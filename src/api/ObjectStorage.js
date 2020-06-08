import axios from 'axios'
var querystring = require('querystring')

export default {
  listBuckets (providerId, projectId) {
    return axios.get(`object-storages/${providerId}/${projectId}/bucket/`)
      .then(response => {
        return response.data
      })
  },

  listBucketObjects (providerId, projectId, bucketId) {
    return axios.get(`object-storages/${providerId}/${projectId}/bucket/${bucketId}/object/`)
      .then(response => {
        return response.data
      })
  },

  createBucket (providerId, projectId, payload) {
    return axios.post(`object-storages/${providerId}/${projectId}/bucket/`, querystring.stringify(payload))
      .then(response => {
        return response
      })
  },

  uploadBucketObjects (providerId, projectId, bucketId, payload) {
    return axios.post(`object-storages/${providerId}/${projectId}/bucket/${bucketId}/object/`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        return response
      })
  }
}
