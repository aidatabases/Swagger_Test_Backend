import axios from 'axios'

export default{
  getScopes () {
    return axios.get(`/auth/user_role_scopes`)
      .then(response => {
        return response.data
      })
  }
}
