import axios from 'axios'

export default {
  listImages (providerId) {
    return axios.get(`provider/${providerId}/compute/images/`)
      .then(response => {
        return response.data
      })
  }
}
