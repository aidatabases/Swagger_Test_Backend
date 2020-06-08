import axios from 'axios'
var querystring = require('querystring')

export default {
  listScalingGroups (providerId, projectId, payload) {
    return axios.get(`provider/${providerId}/${projectId}/scaling_groups/`, {
      params: payload
    })
      .then(response => {
        return response
      })
  },

  resizeScalingGroup (providerId, projectId, scalingGroupId, payload) {
    return axios.patch(`provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}`, payload)
      .then(response => {
        return response.data
      })
  },

  getDetails (providerId, projectId, scalingGroupId) {
    return axios.get(`provider/${providerId}/${projectId}/scaling_groups/${scalingGroupId}`)
      .then(response => {
        return response.data
      })
  },

  createScalingGroup (providerId, projectId, payload) {
    return axios
      .post(`provider/${providerId}/${projectId}/scaling_group/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  listComputes (providerId, projectId, scalingGroupId) {
    return axios.get(`provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}/compute/`)
      .then(response => {
        return response.data
      })
  },

  deleteScalingGroup (providerId, projectId, scalingGroupId) {
    return axios
      .delete(`provider/${providerId}/${projectId}/scaling_group/${scalingGroupId}`)
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
  }
}
