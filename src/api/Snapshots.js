import axios from 'axios'
var querystring = require('querystring')

export default {
  list (providerId, projectId, computeId) {
    return axios.get(`provider/${providerId}/${projectId}/compute/${computeId}/snapshot/`)
      .then(response => {
        return response.data
      })
  },

  listAll (providerId, projectId) {
    return axios.get(`provider/${providerId}/${projectId}/snapshot/`)
      .then(response => {
        return response.data
      })
  },

  create (providerId, projectId, computeId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/compute/${computeId}/snapshot/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  delete (providerId, projectId, snapshotId) {
    return axios.delete(`provider/${providerId}/${projectId}/compute/snapshot/${snapshotId}/`)
      .then(response => {
        return response.data
      })
  },

  converToImage (providerId, projectId, snapshotId) {
    return axios.post(`provider/${providerId}/${projectId}/snapshot/${snapshotId}/convert-to-image/`)
      .then(response => {
        return response.data
      })
  }
}
