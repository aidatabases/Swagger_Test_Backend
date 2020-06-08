import axios from 'axios'
var querystring = require('querystring')

export default {
  listComputes (providerId, projectId, payload) {
    return axios
      .get(`provider/${providerId}/${projectId}/compute/`, {
        params: payload
      })
      .then(response => {
        return response
      })
  },

  resizeComputes (providerId, projectId, computeId, flavorId) {
    return axios
      .get(
        `provider/${providerId}/${projectId}/compute/${computeId}/resize/${flavorId}`
      )
      .then(response => {
        return response.data
      })
  },

  performAction (providerId, projectId, computeId, action) {
    return axios
      .get(`provider/${providerId}/${projectId}/compute/${computeId}/${action}`)
      .then(response => {
        return response.data
      })
  },

  createCompute (payload) {
    return axios
      .post(
        `provider/${payload.provider_id}/${payload.project_id}/compute/`,
        querystring.stringify(payload)
      )
      .then(response => {
        return response.data
      })
  },

  getCompute (providerId, projectId, computeId) {
    return axios
      .get(`provider/${providerId}/${projectId}/compute/${computeId}/`)
      .then(response => {
        return response.data
      })
  },

  deleteCompute (providerId, projectId, computeId) {
    return axios
      .delete(`provider/${providerId}/${projectId}/compute/${computeId}/`)
      .then(response => {
        return response.data
      })
  },

  searchComputes (providerId, projectId, payload) {
    return axios
      .get(`provider/${providerId}/${projectId}/compute/find/${payload.search}`, {
        params: payload
      })
      .then(response => {
        return response
      })
  },

  listComputesByProvider (providerId) {
    return axios.get(`provider/${providerId}/compute/`).then(response => {
      return response.data
    })
  },

  listFlavors (providerId) {
    return axios
      .get(`provider/${providerId}/compute/flavors/`)
      .then(response => {
        return response.data
      })
  },

  listImages (providerId) {
    return axios.get(`provider/${providerId}/compute/images`).then(response => {
      return response.data
    })
  },

  createSnapshot (payload) {
    return axios
      .post(
        `provider/${payload.provider_id}/compute/${
          payload.compute_id
        }/snapshot/`,
        payload
      )
      .then(response => {
        return response.data
      })
  },

  getLogs (providerId, projectId, computeId, lines) {
    return axios.get(`provider/${providerId}/${projectId}/compute/${computeId}/console_log/${lines}`)
      .then(response => {
        return response.data
      })
  },

  getConsoleUrl (providerId, projectId, computeId) {
    return axios.get(`provider/${providerId}/${projectId}/compute/${computeId}/console_url`)
      .then(response => {
        return response.data
      })
  }
}
