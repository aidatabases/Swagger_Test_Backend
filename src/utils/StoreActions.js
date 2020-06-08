import store from 'vuex-store'

function _isStoreActionCached (storeActionName, storeActionParams) {
  return store.cache.has(storeActionName, storeActionParams)
}

function _getCachedStoreActionInstance (storeActionName, storeActionParams) {
  return store.cache.dispatch(storeActionName, storeActionParams)
}

export function performStoreAction (storeActionName, storeActionParams) {
  if (_isStoreActionCached(storeActionName, storeActionParams)) {
    return _getCachedStoreActionInstance(storeActionName, storeActionParams)
  }
  // it's first execution make sure to delete cache once action completed
  return _getCachedStoreActionInstance(storeActionName, storeActionParams)
    .catch((error) => {
      return Promise.reject(error)
    })
    .finally(() => {
      store.cache.delete(storeActionName, storeActionParams)
    })
}
