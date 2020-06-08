import axios from 'axios'

export default {
  listTeams () {
    return axios.get(`teams/`)
      .then(response => {
        return response.data
      })
  },

  createTeam (payload) {
    return axios.post(`teams/`, payload)
      .then(response => {
        return response.data
      })
  },

  getTeam (id) {
    return axios.get(`teams/{id}`(id))
      .then(response => {
        return response.data
      })
  },

  listTeamMembers (id) {
    return axios.get(`teams/{id}/members/`(id))
      .then(response => {
        return response.data
      })
  },

  addTeamMember (teamId, payload) {
    return axios.post(`teams/{teamId}/members`, payload)
      .then(response => {
        return response.data
      })
  }
}
