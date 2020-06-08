import VolumesApi from '@/api/Volumes'
import { socket } from '@/utils/Socket'

export default {
  namespaced: true,
  strict: true,

  state: {
    volumes: [],
    totalVolumeRecords: 0
  },

  mutations: {
    SET (state, payload) {
      state.volumes = payload
    },
    SET_ONE (state, volume) {
      let indexOfVolume = state.volumes.findIndex(v => v.id === volume.id)
      state.volumes.splice(indexOfVolume, 1, volume)
    },
    UPDATE_ONE (state, { volumeId, updates }) {
      let indexOfVolume = state.volumes.findIndex(v => v.id === volumeId)
      state.volumes[indexOfVolume] = Object.assign({}, state.volumes[indexOfVolume], updates)
      state.volumes.splice(indexOfVolume, 1, state.volumes[indexOfVolume])
    },
    RESET (state) {
      state.volumes = []
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalVolumeRecords = (payload && !!payload['x-total-count']) ? parseInt(payload['x-total-count'], 10) : 0
    }
  },

  actions: {
    LIST (context, payload) {
      context.dispatch('loader/addMessage', { type: 'volume-list', msg: 'Fetching Volumes !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      // return your ajax request as promise
      return VolumesApi.listVolumes(providerId, projectId, payload)
        .then(volumes => {
          context.commit('SET', volumes.data)
          context.commit('SET_TOTAL_COUNT', volumes.headers)
          return volumes.data
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'volume-list' }, { root: true })
        })
    },

    STATUS (context, { taskId }) {
      if (!taskId) {
        return Promise.reject(new Error('Invalid Task Id'))
      }
      socket.emit('join_room', { 'taskId': taskId })
      let promise = new Promise(function (resolve, reject) {
        socket.on(taskId, ({ data }) => {
          if (data['status_code']) {
            let statusCode = parseInt(data['status_code'])
            if (statusCode >= 200 && statusCode < 300) {
              return resolve(data)
            }
            if (statusCode >= 400) {
              return reject(data)
            }
          }
        })
      })
      return promise
    },

    GET (context, volumeId) {
      context.dispatch('loader/addMessage', { type: 'get-volume-by-id', msg: 'Fetching Volume' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      return VolumesApi.getVolume(providerId, projectId, volumeId)
        .then(volume => {
          context.commit('SET_ONE', volume)
          return volume
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'get-volume-by-id' }, { root: true })
        })
    },

    CREATE (context, { providerId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'volumes-create', msg: 'Creating Disk !' }, { root: true })
      return VolumesApi.createVolume(providerId, projectId, payload)
        .then(volume => {
          context.commit('SET_ONE', volume)
          return volume
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'volumes-create' }, { root: true })
        })
    },

    DELETE (context, payload) {
      context.dispatch('loader/addMessage', { type: 'volumes-delete', msg: 'Deleting your Disk !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let volumeId = payload.volume_id
      return VolumesApi.deleteVolume(providerId, projectId, volumeId, payload)
        .then(volume => {
          return volume
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'volumes-delete' }, { root: true })
        })
    },

    ATTACH (context, payload) {
      context.dispatch('loader/addMessage', { type: 'volumes-attach', msg: 'Attaching your Disk !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let volumeId = payload.volume_id
      return VolumesApi.attachVolume(providerId, projectId, volumeId, payload)
        .then(volume => {
          return volume
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'volumes-attach' }, { root: true })
        })
    },

    DETACH (context, payload) {
      context.dispatch('loader/addMessage', { type: 'volumes-detach', msg: 'Detaching your Disk !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let volumeId = payload.volume_id
      return VolumesApi.detachVolume(providerId, projectId, volumeId, payload)
        .then(volume => {
          return volume
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'volumes-detach' }, { root: true })
        })
    },

    UPDATELOCALSTORE (context, data) {
      context.commit('UPDATE_ONE', data)
      return Promise.resolve()
    }
  },

  getters: {
    getSelectedProjectName (state) {
      if (state.selectedProject) {
        return state.selectedProject['name']
      }
      return ''
    },

    getSelectedProject (state) {
      return state.selectedProject
    },

    volumes (state, getters, rootState, rootGetters) {
      return state.volumes
    },

    getSelectedProjectId (state) {
      if (state.selectedProject) {
        return state.selectedProject['id']
      }
      return ''
    },

    freeVolumes (state) {
      return state.volumes.filter(vol => vol.volume_attach_volume.length < 1)
    },

    totalVolumeRecords (state) {
      return state.totalVolumeRecords
    }
  }
}
