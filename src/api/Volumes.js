import axios from 'axios'
var querystring = require('querystring')

export default {
  listVolumes (providerId, projectId, payload) {
    return axios.get(`provider/${providerId}/${projectId}/volume/`, {
      params: payload
    })
      .then(response => {
        return response
      })
  },

  createVolume (providerId, projectId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/volume/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  deleteVolume (providerId, projectId, volumeId, payload) {
    return axios.delete(`provider/${providerId}/${projectId}/volume/${volumeId}/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  attachVolume (providerId, projectId, volumeId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/volume/volume_attach/${volumeId}/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  detachVolume (providerId, projectId, volumeId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/volume/volume_detach/${volumeId}/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  getVolume (providerId, projectId, volumeId) {
    return axios.get(`provider/${providerId}/${projectId}/volume/${volumeId}/`)
      .then(response => {
        return response.data
      })
  }
}
