import Vue from 'vue'
import { performAction } from '@/utils/ActionCache'

function _updateLocalStore (scalingGroupId, updates) {
  let storeActionName = 'scalingGroups/UPDATE_LOCAL_STORE'
  let storeActionParams = { scalingGroupId, updates }
  return performAction(storeActionName, storeActionParams)
}

function _updateComputeLocalStore (computeId, updates) {
  let storeActionName = 'scalingGroups/UPDATE_COMPUTE_LOCAL_STORE'
  let storeActionParams = { computeId, updates }
  return performAction(storeActionName, storeActionParams)
}

function _generateStatusTaskId (computeId) {
  if (!computeId) {
    return Promise.reject(new Error(`Compute id is required.`))
  }
  let storeActionName = 'scalingGroups/status'
  let storeActionParams = { compute_id: computeId }
  return performAction(storeActionName, storeActionParams, (taskDetails) => {
    return Promise.resolve(taskDetails)
  })
}

function _isVmStatusCached (vm) {
  return !!vm._meta
}

function _isVmProcessed (vm) {
  return !vm.task_id
}

function _vmStatus (scalingGroupId, vm) {
  let computeId = vm.id
  if (_isVmStatusCached(vm)) {
    return Promise.resolve()
  }
  if (!_isVmProcessed(vm)) {
    return _socketStatus(vm.task_id)
      .then(listScalingGroupsComputes(scalingGroupId))
  }
  let taskIdPromise = _generateStatusTaskId(computeId)

  taskIdPromise
    .then((taskDetails) => {
      let taskId = taskDetails['task_id']
      let status = taskDetails['message']
      let updates = { '_meta': { 'status': status, taskId } }
      _updateComputeLocalStore(computeId, updates)
    })

  return taskIdPromise
    .then((taskDetails) => {
      return _socketStatus(taskDetails['task_id'])
    })
    .then(({ data }) => {
      let updates = { _meta: { 'status': data, taskId: '' } }
      return _updateComputeLocalStore(computeId, updates)
    })
}

function _socketStatus (taskId, callback) {
  let storeActionName = 'scalingGroups/SOCKET_STATUS'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams, (socketStatus) => {
    return Promise.resolve(socketStatus)
  })
}

export function listScalingGroups (recordPerPage = 10, offset = 0) {
  let storeActionName = 'scalingGroups/list'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset }
  let callback = (scalingGroups) => {
    scalingGroups.forEach((v) => {
      // to cover taskId which are not created here
      v.task_id && scalingGroupStatus(v.task_id)
        .then((socketStatus) => {
          if (socketStatus['status_code']) {
            let statusMsg = socketStatus['message']
            Vue.notify({
              group: 'success',
              duration: 10000,
              title: 'Notification',
              text: statusMsg
            })
          }
        })
        .catch((socketStatus) => {
          if (socketStatus['status_code']) {
            let statusMsg = socketStatus['message']
            Vue.notify({
              group: 'error',
              duration: -1,
              title: 'Error Notification !!',
              text: statusMsg
            })
          }
        })
        .finally(listScalingGroups)
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function scalingGroupStatus (taskId) {
  if (!taskId) {
    return Promise.reject(new Error(`Invalid Task Id ${taskId}`))
  }
  let storeActionName = 'scalingGroups/SOCKET_STATUS'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams)
}

export function deleteScalingGroup (scalingGroupId) {
  let storeActionName = 'scalingGroups/delete'
  let storeActionParams = { scalingGroupId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(scalingGroupId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _socketStatus(taskId)
      })
      .finally(listScalingGroups)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function resizeScalingGroup (scalingGroupId, flavorId, clusterSize) {
  let storeActionName = 'scalingGroups/resize'
  let storeActionParams = {
    scalingGroupId,
    data: [
      {
        'op': 'replace',
        'path': '/flavor_id',
        'value': flavorId
      },
      {
        'op': 'replace',
        'path': '/cluster_size',
        'value': clusterSize
      }
    ]
  }
  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['action']
    _updateLocalStore(scalingGroupId, {
      action: status,
      task_id: taskId,
      _meta: { 'status': status } })
      .then(() => {
        return _socketStatus(taskId)
      })
      .finally(listScalingGroups)
  }

  return performAction(storeActionName, storeActionParams, callback)
}

export function listScalingGroupsComputes (scalingGroupId) {
  let storeActionName = 'scalingGroups/computeList'
  let storeActionParams = { 'scalingGroupId': scalingGroupId }
  let callback = (vms) => {
    vms.forEach((vm) => {
      _vmStatus(scalingGroupId, vm)
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function startCompute (scalingGroupId, computeId) {
  let storeActionName = 'scalingGroups/START_COMPUTE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateComputeLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _socketStatus(taskId)
      })
      .finally(() => {
        listScalingGroupsComputes(scalingGroupId)
      })
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function stopCompute (scalingGroupId, computeId) {
  let storeActionName = 'scalingGroups/STOP_COMPUTE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateComputeLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _socketStatus(taskId)
      })
      .finally(() => {
        listScalingGroupsComputes(scalingGroupId)
      })
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function restartCompute (scalingGroupId, computeId) {
  let storeActionName = 'scalingGroups/RESTART_COMPUTE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateComputeLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _socketStatus(taskId)
      })
      .finally(listScalingGroupsComputes(scalingGroupId))
  }
  performAction(storeActionName, storeActionParams, callback)
}
