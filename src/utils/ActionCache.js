import { performStoreAction } from './StoreActions'

var _actionCache = new Map()
const _toString = (arg) => {
  return (typeof arg === 'string' ? arg : JSON.stringify(arg))
}
const _argsToString = (...args) => {
  let type = ''
  args.forEach((arg) => {
    type = `${type}:${_toString(arg)}`
  })
  return type
}

export function performAction (storeActionName, storeActionParams, callback) {
  if (!callback) {
    callback = (res) => {
      console.log('Blank Callback')
      return res
    }
  }
  let type = _argsToString(storeActionName, storeActionParams)
  if (!_actionCache.has(type)) {
    const action = performStoreAction(storeActionName, storeActionParams)
      .catch(error => {
        return Promise.reject(error)
      })
      .then(callback)
      .finally(() => {
        console.log('deleting from cache ' + type)
        _actionCache.delete(type)
      })
    console.log('setting cache for ' + type)
    _actionCache.set(type, action)
  }
  return _actionCache.get(type)
}
