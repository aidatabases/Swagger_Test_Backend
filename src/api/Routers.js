import axios from 'axios'

export default {
  listRouters (provider_id) {
    return axios.get(`provider/{provider_id}/router/`).then(response => {
      return response.data
    })
  },

  createRouter (provider_id, payload) {
    return axios
      .post(`providers/{provider_id}/router/`, payload)
      .then(response => {
        return response.data
      })
  },

  getRouter (provider_id) {
    return axios
      .get(`providers/{provider_id}/router/{router_id}`(id))
      .then(response => {
        return response.data
      })
  }
}
