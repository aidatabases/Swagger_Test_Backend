import { performAction } from '@/utils/ActionCache'

export function listNetworks (recordPerPage = 10, offset = 0) {
  let storeActionName = 'networks/list'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset }
  return performAction(storeActionName, storeActionParams)
}

export function deleteSubnet (networkId, subnetId) {
  let storeActionName = 'networks/deleteSubnet'
  let storeActionParams = { networkId, subnetId }

  const callback = (value) => {
    listNetworks()
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function deleteNetwork (networkId) {
  let storeActionName = 'networks/deleteNetwork'
  let storeActionParams = { networkId }

  const callback = (value) => {
    listNetworks()
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function attachNetwork (computeId, networkId) {
  let storeActionName = 'networks/attachNetwork'
  let storeActionParams = {
    'compute_id': computeId,
    'network_id': networkId
  }

  const callback = (value) => {
    listNetworks()
  }
  performAction(storeActionName, storeActionParams, callback)
}

export function detachNetwork (computeId, networkId) {
  let storeActionName = 'networks/detachNetwork'
  let storeActionParams = {
    'compute_id': computeId,
    'network_id': networkId
  }

  const callback = (value) => {
    listNetworks()
  }
  performAction(storeActionName, storeActionParams, callback)
}
