import axios from 'axios'
var querystring = require('querystring')

export default {
  list (providerId, projectId, payload) {
    return axios.get(`load-balancers/${providerId}/${projectId}/`, {
      params: payload
    })
      .then(response => {
        return response
      })
  },
  getLoadBalancer (providerId, projectId, lbId) {
    return axios.get(`load-balancers/${providerId}/${projectId}/${lbId}`)
      .then(response => {
        return response.data
      })
  },
  create (providerId, projectId, payload) {
    return axios.post(`load-balancers/${providerId}/${projectId}/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
  },
  delete (providerId, projectId, id) {
    return axios
      .delete(`load-balancers/${providerId}/${projectId}/${id}`)
      .then(response => {
        return response.data
      })
  }
}
