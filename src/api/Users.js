import axios from 'axios'
var querystring = require('querystring')

export default{
  listUsers () {
    return axios.get(`users/`)
      .then(response => {
        return response.data
      })
  },

  createUser (organisationId, payload) {
    return axios.post(`/utils/${organisationId}/inituserforproject`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  getUser (id) {
    return axios.get(`users/${id}`)
      .then(response => {
        return response.data
      })
  },

  getCaptchaKey () {
    return axios.get(`users/signup_form`)
      .then(response => {
        return response.data
      })
  },

  checkToken (token) {
    return axios.get(`users/me`, { 'headers': { 'authorization': `Bearer ${token}` } })
      .then(response => {
        return response.data
      })
  },

  user () {
    return axios.get(`users/me`)
      .then(response => {
        return response.data
      })
  }
}
