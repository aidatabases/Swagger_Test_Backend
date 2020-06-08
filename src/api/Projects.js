import axios from 'axios'
var querystring = require('querystring')

export default{
  listProjects (organisationId) {
    return axios.get(`/organisation/${organisationId}/project/`)
      .then(response => {
        return response.data
      })
  },

  listProjectUsers (organisationId, projectId) {
    return axios.get(`/organisation/${organisationId}/${projectId}/userlist/`)
      .then(response => {
        return response.data
      })
  },

  detachProjectUser (organisationId, projectId, payload) {
    return axios.post(`/organisation/${organisationId}/${projectId}/user/detach`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  attachProjectUser (organisationId, projectId, payload) {
    return axios.post(`/organisation/${organisationId}/${projectId}/user`, querystring.stringify(payload))
      .then(response => {
      })
  },

  createProject (organisationId, payload) {
    return axios.post(`/organisation/${organisationId}/project/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  initProvider (organisationId, providerId, projectId, payload) {
    return axios.post(`/organisation/${organisationId}/${providerId}/${projectId}/init/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  getProject (organisationId, projectId) {
    return axios.get(`/organisation/${organisationId}/${projectId}`)
      .then(response => {
        return response.data
      })
  }
}
