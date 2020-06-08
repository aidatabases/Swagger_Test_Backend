import { performAction } from '@/utils/ActionCache'
import vueInstance from '../main'

function _updateLocalStore (computeId, updates) {
  let storeActionName = 'virtualMachines/UPDATE_LOCAL_STORE'
  let storeActionParams = { computeId, updates }
  return performAction(storeActionName, storeActionParams)
}

function _vmSocketStatus (taskId, callback) {
  let storeActionName = 'virtualMachines/SOCKET_STATUS'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams, (socketStatus) => {
    return Promise.resolve(socketStatus)
  })
}

function _generateStatusTaskId (computeId) {
  if (!computeId) {
    return Promise.reject(new Error(`Compute id is required.`))
  }
  let storeActionName = 'virtualMachines/STATUS'
  let storeActionParams = { compute_id: computeId }
  return performAction(storeActionName, storeActionParams, (taskDetails) => {
    return Promise.resolve(taskDetails)
  })
}

function _vmStatus (vm) {
  let computeId = vm.id
  // if (_isVmStatusCached(vm)) {
  //   return Promise.resolve()
  // }
  if (!_isVmProcessed(vm)) {
    return _vmSocketStatus(vm.task_id)
      .catch(response => {
        if (response && response['status_code'] && response['message']) {
          vueInstance.$notify({
            group: 'error',
            type: 'error',
            title: 'Error Notification',
            text: `${response['message']}`,
            duration: 120000
          })
        }
      })
      .finally(() => {
        listVms()
      })
  }
  let taskIdPromise = _generateStatusTaskId(computeId)

  taskIdPromise
    .then((taskDetails) => {
      let taskId = taskDetails['task_id']
      let status = taskDetails['message']
      _updateLocalStore(computeId, { _meta: { 'status': status, taskId } })
    })

  return taskIdPromise
    .then((taskDetails) => {
      return _vmSocketStatus(taskDetails['task_id'])
    })
    .then(({ data }) => {
      return _updateLocalStore(computeId, { _meta: { 'status': data, taskId: '' } })
    })
}

function _isVmProcessed (vm) {
  return !vm.task_id
}

// function _isVmStatusCached (vm) {
//   return !!vm._meta
// }

export function listVms (recordPerPage = 10, offset = 0) {
  let storeActionName = 'virtualMachines/LIST'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset }
  let callback = (vms) => {
    vms.forEach((vm) => {
      _vmStatus(vm)
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function getOne (computeId) {
  let storeActionName = 'virtualMachines/GET_ONE'
  let storeActionParams = { 'compute_id': computeId }
  return performAction(storeActionName, storeActionParams, (vm) => {
    return vm
  })
}

export function startVm (computeId) {
  let storeActionName = 'virtualMachines/START'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function stopVm (computeId) {
  let storeActionName = 'virtualMachines/STOP'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function pauseVm (computeId) {
  let storeActionName = 'virtualMachines/PAUSE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function unpauseVm (computeId) {
  let storeActionName = 'virtualMachines/UNPAUSE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function deleteVm (computeId) {
  let storeActionName = 'virtualMachines/DELETE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']

    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function restartVm (computeId) {
  let storeActionName = 'virtualMachines/RESTART'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function hardRestartVm (computeId) {
  let storeActionName = 'virtualMachines/HARD_RESTART'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function rebuildVm (computeId) {
  let storeActionName = 'virtualMachines/REBUILD'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function resizeVm (computeId, flavorId) {
  let storeActionName = 'virtualMachines/RESIZE'
  let storeActionParams = { 'computeId': computeId, 'flavorId': flavorId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function confirmResizeVm (computeId) {
  let storeActionName = 'virtualMachines/CONFIRM_RESIZE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function revertResizeVm (computeId) {
  let storeActionName = 'virtualMachines/REVERT_RESIZE'
  let storeActionParams = { 'compute_id': computeId }

  const callback = (value) => {
    let taskId = value['task_id']
    let status = value['message']
    _updateLocalStore(computeId, { task_id: taskId, _meta: { 'status': status } })
      .then(() => {
        return _vmSocketStatus(taskId)
      })
      .finally(listVms)
  }
  performAction(storeActionName, storeActionParams, callback)
}

// Filter VMs function is used to filter VM table data
export function filterVms (query, recordPerPage, offset) {
  let storeActionName = 'virtualMachines/FILTER'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset, 'search': query }
  let callback = (vms) => {
    vms.forEach((vm) => {
      _vmStatus(vm)
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}
