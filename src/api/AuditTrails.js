import axios from 'axios'

export default {
  listAllAuditTrails (userId, limit, recordId) {
    return axios.get(`audit-trails/${userId}?limit=${limit}&record_id=${recordId}`)
      .then(response => {
        return response.data
      })
  }
}
