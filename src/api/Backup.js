import axios from 'axios'
var querystring = require('querystring')

export default {
  listInstanceBackupServices (providerId, projectId, computeId) {
    return axios.get(`backups/${providerId}/${projectId}/backup-services/${computeId}/`)
      .then(response => {
        return response.data
      })
  },

  getBackupIP (providerId, projectId, computeId) {
    return axios.get(`backups/${providerId}/${projectId}/backup-IP/${computeId}/`)
      .then(response => {
        return response.data
      })
  },

  listAllBackupServices (providerId, projectId) {
    return axios.get(`backups/${providerId}/${projectId}/backup-services/client-registration/`)
      .then(response => {
        return response.data
      })
  },

  createProjectBackupService (providerId, projectId, computeId, payload) {
    return axios.post(`backups/${providerId}/${projectId}/create-backup-services/`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  createInstanceBackupService (providerId, projectId, payload) {
    return axios.post(`backups/${providerId}/${projectId}/backup-services/client-registration`, querystring.stringify(payload))
      .then(response => {
        return response.data
      })
  },

  listBackupsByBackupServiceId (providerId, projectId, backupServiceId) {
    return axios.get(`backups/${providerId}/${projectId}/backup-services-details/${backupServiceId}`)
      .then(response => {
        return response.data
      })
  }
}
