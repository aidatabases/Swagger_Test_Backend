import axios from 'axios'
var querystring = require('querystring')

export default {
  listRoutableIP (organisationId, providerId, projectId) {
    return axios.get(`organisation/${organisationId}/${providerId}/${projectId}/routable_ip/`)
      .then(response => {
        return response.data
      })
  },

  listAllotedIPsByProject (projectId) {
    return axios.get(`organisation/publicip/${projectId}/allocated_public_ip/`)
      .then(response => {
        return response.data
      })
  },

  listAllotedIPsByProvider (providerId) {
    return axios.get(`organisation/publicip/${providerId}/allocated_public_ip/`)
      .then(response => {
        return response.data
      })
  },

  listAllotedIPsByProviderAndProject (providerId, projectId) {
    return axios.get(`organisation/publicip/${providerId}/${projectId}/allocated_public_ip/`)
      .then(response => {
        return response.data
      })
  },

  listImportedIPsByProvider (providerId) {
    return axios.get(`organisation/publicip/${providerId}/public_ip/`)
      .then(response => {
        return response.data
      })
  },

  detailsById (providerId, publicIpId) {
    return axios.get(`organisation/publicip/${providerId}/${publicIpId}`)
      .then(response => {
        return response.data
      })
  },

  requestPublicIP (providerId, projectId, payload) {
    return axios.post(`organisation/publicip/${providerId}/${projectId}/request_public_ip/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  }
}
