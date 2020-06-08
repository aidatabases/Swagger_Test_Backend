import ObjectStorageApi from '../../api/ObjectStorage'

export default {
  namespaced: true,

  state: {
    buckets: []
  },

  mutations: {
    SET_BUCKETS (state, payload) {
      state.buckets = payload
    }
  },

  actions: {
    listBuckets (context) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'bucket-list', msg: 'Fetching bucket list...' }, { root: true })

      return ObjectStorageApi.listBuckets(providerId, projectId)
        .then(response => {
          context.commit('SET_BUCKETS', response)
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'bucket-list' }, { root: true })
        })
    },

    listBucketObjects (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let bucketId = payload.bucketId
      context.dispatch('loader/addMessage', { type: 'bucket-list', msg: 'Fetching bucket list...' }, { root: true })

      return ObjectStorageApi.listBucketObjects(providerId, projectId, bucketId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'bucket-list' }, { root: true })
        })
    },

    create (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'bucket-create', msg: 'Please wait. Creating bucket..' }, { root: true })
      return ObjectStorageApi.createBucket(providerId, projectId, payload)
        .then(response => {
          return response
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'bucket-create' }, { root: true })
        })
    },

    uploadBucketObjects (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let bucketId = payload.bucketId
      let postData = payload.file
      context.dispatch('loader/addMessage', { type: 'upload-bucket-object', msg: 'Please wait. Uploading files to bucket..' }, { root: true })
      return ObjectStorageApi.uploadBucketObjects(providerId, projectId, bucketId, postData)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'upload-bucket-object' }, { root: true })
        })
    }
  },

  getters: {
    buckets (state) {
      return state.buckets
    }
  }
}
