import axios from 'axios'
var querystring = require('querystring')

export default {
  listSecurityGroups (providerId, projectId, payload) {
    return axios.get(`provider/${providerId}/${projectId}/securitygroup/`, {
      params: payload
    })
      .then(response => {
        return response
      })
  },

  createSecurityGroup (providerId, projectId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/securitygroup/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  deleteSecurityGroup (providerId, projectId, securityGroupId) {
    return axios.delete(`provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/`)
      .then(response => {
        return response.data
      })
  },

  getSecurityGroup (providerId, projectId, securityGroupId) {
    return axios.get(`provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/`)
      .then(response => {
        return response.data
      })
  },

  listSecurityGroupRules (providerId, projectId, securityGroupId) {
    return axios.get(`provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/`)
      .then(response => {
        return response.data
      })
  },

  removeSecurityGroupRule (providerId, projectId, securityGroupId, securityGroupRuleId) {
    return axios.delete(`provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/${securityGroupRuleId}/`)
      .then(response => {
        return response.data
      })
  },

  createSecurityGroupRule (providerId, projectId, securityGroupId, payload) {
    return axios.post(`provider/${providerId}/${projectId}/securitygroup/${securityGroupId}/securitygrouprule/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  }
}
