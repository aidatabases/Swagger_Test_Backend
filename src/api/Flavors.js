import axios from 'axios'

export default {
  listFlavors (providerId) {
    return axios.get(`provider/${providerId}/compute/flavors/`)
      .then(response => {
        return response.data
      })
  }
}
