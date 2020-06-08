import BackupApi from '@/api/Backup'

export default {
  namespaced: true,
  strict: true,

  state: {
    backups: []
  },

  mutations: {
    SET (state, payload) {
      state.backups = payload
    }
  },

  actions: {
    LIST_SERVICES (context, { computeId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'backup-service-list-by-compute-id', msg: 'Fetching Backups!' }, { root: true })
      return BackupApi.listInstanceBackupServices(providerId, projectId, computeId)
        .then(result => {
          return result
        })
        .catch(error => {
          console.log(`An error (${error.message}) occurred while fetching Backups for instance id ${computeId}`)
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'backup-service-list-by-compute-id' }, { root: true })
        })
    },

    BACKUP_IP (context, { computeId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'backup-service-get-ip', msg: 'Fetching Backup IP!' }, { root: true })
      return BackupApi.getBackupIP(providerId, projectId, computeId)
        .then(result => {
          return result
        })
        .catch(error => {
          console.log(`An error (${error.message}) occurred while fetching Backup IP for instance id ${computeId}`)
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'backup-service-get-ip' }, { root: true })
        })
    },

    LIST_ALL_SERVICES (context) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'backup-service-list', msg: 'Fetching backup!' }, { root: true })
      return BackupApi.listAllBackupServices(providerId, projectId)
        .then(result => {
          context.commit('SET', result)
          return result
        })
        .catch(error => {
          console.log(`An error (${error.message}) occurred while fetching Backups !`)
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'backup-service-list' }, { root: true })
        })
    },
    LIST_SERVICE_BACKUPS (context, { backupServiceId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'backup-list-by-service-id', msg: 'Fetching backups!' }, { root: true })
      return BackupApi.listBackupsByBackupServiceId(providerId, projectId, backupServiceId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'backup-list-by-service-id' }, { root: true })
        })
    },
    CREATE_INSTANCE_SERVICE (context, { computeId, backupFolderLocation }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let payload = {}
      payload['compute_id'] = computeId
      payload['backup_file_location'] = backupFolderLocation
      payload['provider_id'] = providerId
      payload['project_id'] = projectId
      context.dispatch('loader/addMessage', { type: 'backup-create', msg: 'Creating Backup' }, { root: true })
      return BackupApi.createInstanceBackupService(providerId, projectId, payload)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'backup-create' }, { root: true })
        })
    }
  },

  getters: {
    backups (state) {
      return state.backups
    }
  }
}
