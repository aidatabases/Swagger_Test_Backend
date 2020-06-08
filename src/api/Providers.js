import axios from 'axios'
var querystring = require('querystring')

export default {
  listProviders () {
    return axios.get(`providers/`)
      .then(response => {
        return response.data
      })
  },

  listAvailableProviders (payload) {
    return axios.post(`/organisation/available_providers`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  createProvider (payload) {
    return axios.post(`providers/`, payload)
      .then(response => {
        return response.data
      })
  },

  listProviderTypes () {
    return axios.get(`providers/type`)
      .then(response => {
        return response.data
      })
  },

  getProviderType (id) {
    return axios.get(`providers/type/${id}`)
      .then(response => {
        return response.data
      })
  },

  getProvider (providerId) {
    return axios.get(`providers/${providerId}`)
      .then(response => {
        return response.data
      })
  }
}
