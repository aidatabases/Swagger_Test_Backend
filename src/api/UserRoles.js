import axios from 'axios'
var querystring = require('querystring')

export default{
  listRoles (organisationId) {
    return axios.get(`/role_permission_group/organisation/?organisation_id=${organisationId}`)
      .then(response => {
        return response.data
      })
  },
  createRole (payload) {
    return axios.post(`/role_permission_group/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  }
}
