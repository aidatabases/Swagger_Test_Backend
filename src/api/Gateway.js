import axios from 'axios'
var querystring = require('querystring')

export default {
  getDetails (providerId, projectId) {
    return axios
      .get(`/organisation/${providerId}/${projectId}/gateway/`)
      .then(response => {
        return response.data
      })
  },

  listServices (providerId, projectId) {
    return axios
      .get(`/organisation/${providerId}/${projectId}/gateway_services/`)
      .then(response => {
        return response.data
      })
  },

  createService (providerId, projectId, payload) {
    return axios
      .post(`/organisation/${providerId}/${projectId}/gateway_services/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  performAction (providerId, projectId, gatewayServiceId, action) {
    return axios
      .post(`/organisation/${providerId}/${projectId}/${gatewayServiceId}/${action}/`)
      .then(response => {
        return response.data
      })
  }
}
