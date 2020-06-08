import axios from 'axios'
var querystring = require('querystring')

export default{
  listNetworks (providerId, projectId, payload) {
    return axios.get(`provider/${providerId}/${projectId}/network/`, {
      params: payload
    })
      .then(response => {
        return response
      })
  },

  createNetwork (providerId, projectId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/network_with_subnet/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  getNetwork (providerId, projectId, networkId) {
    return axios.get(`provider/${providerId}/${projectId}/network/${networkId}/?limit=20`)
      .then(response => {
        return response.data
      })
  },

  listSubNetworks (providerId, networkId) {
    return axios.get(`provider/{providerId}/network/{networkId}/subnet/`)
      .then(response => {
        return response.data
      })
  },

  createSubNetwork (providerId, projectId, networkId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/network/${networkId}/subnet/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  getSubNetwork (providerId, networkId, subnetId) {
    return axios.get(`provider/{providerId}/network/{networkId}/subnet/{subnetId}/`)
      .then(response => {
        return response.data
      })
  },

  deleteSubnet (providerId, projectId, networkId, subnetId) {
    return axios.delete(`provider/${providerId}/${projectId}/network/${networkId}/subnet/${subnetId}/`)
      .then(response => {
        return response.data
      })
  },

  deleteNetwork (providerId, projectId, networkId) {
    return axios.delete(`provider/${providerId}/${projectId}/network/${networkId}/`)
      .then(response => {
        return response.data
      })
  },

  attachNetwork (providerId, projectId, computeId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/compute/${computeId}/attach-network/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  detachNetwork (providerId, projectId, computeId, networkId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/compute/${computeId}/detach-network/${networkId}`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  }
}
