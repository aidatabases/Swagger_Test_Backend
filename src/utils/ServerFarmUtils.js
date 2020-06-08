import { performAction } from '@/utils/ActionCache'

export function listFarms (lbId) {
  debugger
  let storeActionName = 'serverFarms/list'
  let storeActionParams = { 'lbId': lbId }
  return performAction(storeActionName, storeActionParams)
}

export function getOne (farmId) {
  let storeActionName = 'serverFarms/getOne'
  let storeActionParams = { farmId }
  return performAction(storeActionName, storeActionParams, (farm) => {
    return farm
  })
}

// export function farmDetails (farmId) {
//   let storeActionName = 'serverFarms/detail'
//   let storeActionParams = { farmId }
//   return performAction(storeActionName, storeActionParams)
// }

export function createFarm () {
  let storeActionName = 'serverFarms/create'
  let storeActionParams = {}
  return performAction(storeActionName, storeActionParams)
}

export function action (lbId, sfId, action) {
  let storeActionName = 'serverFarms/action'
  let storeActionParams = { lbId, sfId, action }
  const callback = (res) => {
    if (res.hasOwnProperty('load_balancer_id')) {
      listFarms(res.load_balancer_id)
    } else {
      this.$router.push('/load-balancer')
    }
  }
  return performAction(storeActionName, storeActionParams, callback)
}
