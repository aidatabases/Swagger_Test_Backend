import { performAction } from '@/utils/ActionCache'

export function sgStatus (taskId) {
  if (!taskId) {
    return Promise.reject(new Error(`Invalid Task Id ${taskId}`))
  }
  let storeActionName = 'securityGroups/status'
  let storeActionParams = { taskId }
  return performAction(storeActionName, storeActionParams)
}

export function listSecurityGroups (recordPerPage = 10, offset = 0) {
  let storeActionName = 'securityGroups/list'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset, storeResult: true }
  let callback = (sgs) => {
    sgs.forEach((sg) => {
      sg.task_id && sgStatus(sg.task_id)
        .finally(() => {
          listSecurityGroups()
        })
    })
    return sgs
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function listNonGWLBSecurityGroups (recordPerPage = 100, offset = 0) {
  let storeActionName = 'securityGroups/list'
  let storeActionParams = { 'limit': recordPerPage, 'offset': offset, 'is_lb_security_group': false, 'is_gw_security_group': false, storeResult: false }
  let callback = (sgs) => {
    return sgs
  }
  return performAction(storeActionName, storeActionParams, callback)
}

export function getOne (sgId) {
  let storeActionName = 'securityGroups/getOne'
  let storeActionParams = { sgId }
  return performAction(storeActionName, storeActionParams, (sg) => {
    return sg
  })
}

export function deleteSecurityGroup (sgId) {
  debugger
  let storeActionName = 'securityGroups/delete'
  let storeActionParams = { sgId }
  return performAction(storeActionName, storeActionParams)
}
