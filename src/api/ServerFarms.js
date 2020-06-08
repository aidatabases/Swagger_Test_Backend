import axios from 'axios'
var querystring = require('querystring')

export default {
  list (providerId, projectId, lbId) {
    return axios.get(`load-balancers/${providerId}/${projectId}/${lbId}/server_farm`)
      .then(response => {
        return response.data
      })
  },
  create (providerId, projectId, lbId, payload) {
    return axios.post(`load-balancers/${providerId}/${projectId}/${lbId}/server_farm`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },
  action (providerId, projectId, lbId, sfId, action) {
    return axios.post(`load-balancers/${providerId}/${projectId}/${lbId}/server_farm/${sfId}/${action}/`)
      .then(response => {
        return response.data
      })
  }
}
