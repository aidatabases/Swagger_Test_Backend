import { performAction } from '@/utils/ActionCache'
import store from 'vuex-store'

export function listBuckets () {
  let storeActionName = 'objectStorage/listBuckets'
  let storeActionParams = {}
  return performAction(storeActionName, storeActionParams)
}

export function listBucketObjects (bucketId) {
  // let storeActionName = 'objectStorage/listBucketObjects'
  // let storeActionParams = { bucketId }
  // return performAction(storeActionName, storeActionParams)
  return store.dispatch('objectStorage/listBucketObjects', { bucketId })
    .then(response => {
      return response
    })
}

export function uploadBucketObjects (payload) {
  let storeActionName = 'objectStorage/uploadBucketObjects'
  let storeActionParams = {

  }
  return performAction(storeActionName, storeActionParams)
}
