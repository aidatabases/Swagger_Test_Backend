import axios from 'axios'

export default {
  getStats (organisationId, providerId) {
    return axios.get(`resource-action-logs/${organisationId}/${providerId}/resourcestat/`).then(response => {
      return response.data
    })
  }
}
