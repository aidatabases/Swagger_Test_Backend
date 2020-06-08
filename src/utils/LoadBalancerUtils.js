import { performAction } from '@/utils/ActionCache'

export function lbStatus (taskId) {
  if (!taskId) {
    return Promise.reject(new Error(`Invalid Task Id ${taskId}`))
  }
  let storeActionName = 'loadBalancers/status'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams)
}

export function listLoadBalancers (recordPerPage = 10, offset = 0) {
  let storeActionName = 'loadBalancers/list'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset }
  let callback = (lbs) => {
    lbs.forEach((lb) => {
      lb.task_id && lbStatus(lb.task_id)
        .finally(() => {
          listLoadBalancers()
        })
    })
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function getOne (lbId) {
  let storeActionName = 'loadBalancers/getOne'
  let storeActionParams = { lbId }
  return performAction(storeActionName, storeActionParams, (lb) => {
    return lb
  })
}

export function deleteLoadBalancer (lbId) {
  let storeActionName = 'loadBalancers/delete'
  let storeActionParams = lbId
  const callback = (value) => {
    listLoadBalancers()
  }
  performAction(storeActionName, storeActionParams, callback)
}
