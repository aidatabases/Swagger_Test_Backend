import { performAction } from '@/utils/ActionCache'

export function _snapshotStatus (taskId) {
  let storeActionName = 'snapshots/SOCKET_STATUS'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams, (socketStatus) => {
    return Promise.resolve(socketStatus)
  })
}

function _updateLocalStore (computeId, updates) {
  let storeActionName = 'virtualMachines/UPDATE_LOCAL_STORE'
  let storeActionParams = { computeId, updates }
  return performAction(storeActionName, storeActionParams)
}

export function listSnapshots () {
  let storeActionName = 'snapshots/LIST_ALL'
  let storeActionParams = {}
  let callback = (snapshots) => {
    snapshots.forEach((snapshot) => {
      snapshot._status = snapshot.task_id ? _snapshotStatus(snapshot.task_id) : Promise.resolve(snapshot.action)
    })
    return snapshots
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function listSnapshotsByComputeId (computeId) {
  let storeActionName = 'snapshots/list'
  let storeActionParams = { computeId }
  let callback = (snapshots) => {
    _updateLocalStore(computeId, { _meta: { 'snapshots': snapshots } })
      .finally(listSnapshotsByComputeId(computeId))
    snapshots.forEach((snapshot) => {
      snapshot._status = snapshot.task_id ? _snapshotStatus(snapshot.task_id) : Promise.resolve(snapshot.action)
    })
    return snapshots
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function deleteSnapshot (computeId, snapshotId) {
  let storeActionName = 'snapshots/DELETE'
  let storeActionParams = { snapshotId }

  const callback = (value) => {
    listSnapshotsByComputeId(computeId)
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function convertToImage (computeId, snapshotId) {
  let storeActionName = 'snapshots/CONVERT_TO_IMAGE'
  let storeActionParams = { snapshotId }

  const callback = (value) => {
    listSnapshotsByComputeId(computeId)
  }
  performAction(storeActionName, storeActionParams, callback)
}
