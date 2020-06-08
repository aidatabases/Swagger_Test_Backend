import SnapshotApi from '@/api/Snapshots'
import { socket } from '@/utils/Socket'

export default {
  namespaced: true,
  strict: true,

  state: {
    snapshots: []
  },

  mutations: {
    SET (state, payload) {
      state.snapshots = payload
    }
  },

  actions: {
    list (context, { computeId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'snapshot-list-by-compute-id', msg: 'Fetching snapshot!' }, { root: true })
      return SnapshotApi.list(providerId, projectId, computeId)
        .then(result => {
          return result
        })
        .catch(error => {
          console.log('An error occurred while fetching Snapshot. Error response : ' + error.message)
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'snapshot-list-by-compute-id' }, { root: true })
        })
    },
    LIST_ALL (context) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'snapshot-list', msg: 'Fetching snapshot!' }, { root: true })
      return SnapshotApi.listAll(providerId, projectId)
        .then(result => {
          // context.commit('SET', result)
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'snapshot-list' }, { root: true })
        })
    },
    SOCKET_STATUS (context, { taskId }) {
      if (!taskId) {
        return Promise.reject(new Error('Invalid Task Id'))
      }
      socket.emit('join_room', { 'taskId': taskId })
      let promise = new Promise(function (resolve, reject) {
        socket.on(taskId, ({ data }) => {
          if (data['status_code']) {
            let statusCode = parseInt(data['status_code'])
            if (statusCode >= 200 && statusCode < 300) {
              return resolve(data)
            }
            if (statusCode >= 400) {
              return reject(data)
            }
          }
        })
      })
      return promise
    },
    DELETE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let snapshotId = payload.snapshotId
      context.dispatch('loader/addMessage', { type: 'snapshot-delete', msg: 'Deleting Snapshot' }, { root: true })
      return SnapshotApi.delete(providerId, projectId, snapshotId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'snapshot-delete' }, { root: true })
        })
    },
    CONVERT_TO_IMAGE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let snapshotId = payload.snapshotId
      context.dispatch('loader/addMessage', { type: 'snapshot-convert-to-image', msg: 'Please wait. Creating image from snapshot.' }, { root: true })
      return SnapshotApi.converToImage(providerId, projectId, snapshotId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'snapshot-convert-to-image' }, { root: true })
        })
    }
  },

  getters: {
    snapshots (state) {
      return state.snapshots
    }
  }
}
