import axios from 'axios'

export default{
  listOrganisations () {
    return axios.get(`organisation/`)
      .then(response => {
        return response.data
      })
  },

  createOrganisation (payload) {
    return axios.post(`organisation/`, payload)
      .then(response => {
        return response.data
      })
  },

  getOrganisation (id) {
    return axios.get(`organisation/${id}`)
      .then(response => {
        return response.data
      })
  }
}
