import { performAction } from '@/utils/ActionCache'

export function listFlavors () {
  let storeActionName = 'flavors/list'
  let storeActionParams = {}
  return performAction(storeActionName, storeActionParams)
}
