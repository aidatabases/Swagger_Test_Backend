import axios from 'axios'
var querystring = require('querystring')

export default {
  listAuthClients () {
    return axios.get(`auth/oauth2_clients/`).then(response => {
      return response.data
    })
  },

  createAuthClient (payload) {
    return axios.post(`auth/oauth2_clients/`, payload).then(response => {
      return response.data
    })
  },

  changeProjectScope (projectId, payload) {
    return axios.post(`/auth/change_project_scope/${projectId}`, payload)
      .then(response => {
        return response.data
      })
  },

  getUserScopes (payload) {
    return axios.get(`auth/user_token_scope`).then(response => {
      return response.data
    })
  },

  getUserRoles (userId) {
    return axios.get(`/role_permission_group/user_role_scope/${userId}/`)
      .then(response => {
        return response.data
      })
  },

  getToken (payload) {
    payload['grant_type'] = 'password'
    // payload['type'] = 'request-body'
    return axios
      .post(process.env.VUE_APP_API_URL + `/auth/oauth2/token`, querystring.stringify(payload))
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        throw error
      })
  },

  logout (payload) {
    return axios
      .post(`auth/logout/`)
      .then(function (response) {
        return response.data
      })
      .catch(function (error) {
        throw error
      })
  },

  validateOtp (otp) {
    return axios.post(`auth/validate_otp/`
      , querystring.stringify({
        'otp': otp
      })
    ).then(response => {
      return response.data
    })
  },

  resendOtp () {
    return axios.get(`auth/resend_otp/`)
      .then(response => {
        return response.data
      })
  }
}
