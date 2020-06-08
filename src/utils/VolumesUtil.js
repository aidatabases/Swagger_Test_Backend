import { performAction } from '@/utils/ActionCache'
import _ from 'lodash'

function _updateLocalStore (volumeId, updates) {
  let storeActionName = 'volumes/UPDATELOCALSTORE'
  let storeActionParams = { volumeId, updates }
  return performAction(storeActionName, storeActionParams)
}

export function createVolume (payload) {
  let storeActionName = 'volumes/CREATE'
  let storeActionParams = { payload }
  const callback = (value) => {
    // let createdVolumeId = value['id']
    let taskId = value['task_id']
    volumeStatus(taskId)
      .finally(() => {
        listVolumes()
      })
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function attachVolume (computeId, volumeId) {
  let storeActionName = 'volumes/ATTACH'
  let storeActionParams = { compute_id: computeId, volume_id: volumeId }
  const callback = (value) => {
    let taskId = value['task_id']
    _updateLocalStore(volumeId, { task_id: taskId, action: 'Attaching' })
      .then(() => {
        return volumeStatus(taskId)
      })
      .finally(listVolumes)
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function detachVolume (computeId, volumeId) {
  let storeActionName = 'volumes/DETACH'
  let storeActionParams = { compute_id: computeId, volume_id: volumeId }
  const callback = (value) => {
    let taskId = value['task_id']
    _updateLocalStore(volumeId, { task_id: taskId, action: 'Detaching' })
      .then(() => {
        return volumeStatus(taskId)
      })
      .finally(listVolumes)
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function deleteVolume (volumeId) {
  let storeActionName = 'volumes/DELETE'
  let storeActionParams = { volume_id: volumeId }
  const callback = (value) => {
    let taskId = value['task_id']
    _updateLocalStore(volumeId, { task_id: taskId, action: 'Deleting' })
      .then(() => {
        return volumeStatus(taskId)
      })
      .finally(listVolumes)
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function getOne (volumeId) {
  let storeActionName = 'volumes/GET'
  let storeActionParams = { volumeId }
  return performAction(storeActionName, storeActionParams)
}

export function volumeStatus (taskId) {
  if (!taskId) {
    return Promise.reject(new Error(`Invalid Task Id ${taskId}`))
  }
  let storeActionName = 'volumes/STATUS'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams)
}

export function listVolumes (recordPerPage = 10, offset = 0, computeId = null) {
  let storeActionName = 'volumes/LIST'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset }

  if (computeId !== null) {
    storeActionParams = _.assign(storeActionParams, { compute_id: computeId })
  }

  let callback = (volumes) => {
    volumes.forEach((v) => {
      // to cover taskId which are not created here
      v.task_id && volumeStatus(v.task_id)
        .finally(listVolumes)
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}
