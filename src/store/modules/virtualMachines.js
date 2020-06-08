import ComputesApi from '@/api/Computes'
import SnapshotApi from '@/api/Snapshots'
import { createVirtualMachine } from '@/models/VirtualMachine'
import _ from 'lodash'
import { socket } from '@/utils/Socket'

export default {
  namespaced: true,

  state: {
    virtualMachines: [],
    totalVmRecords: 0
  },

  mutations: {
    SET (state, payload) {
      // Remove deleted/non existing vms
      let idsOfNonExistingVms = _.difference(_.map(state.virtualMachines, 'id'), _.map(payload, 'id'))
      idsOfNonExistingVms.forEach(id => {
        let indexOfVm = state.virtualMachines.findIndex(i => i.id === id)
        state.virtualMachines.splice(indexOfVm, 1)
        // _.reject(state.virtualMachines, { 'id': id })
      })

      payload.forEach(v => {
        let indexOfVm = state.virtualMachines.findIndex(i => i.id === v.id)
        if (indexOfVm > -1) {
          // we do have this VM, checking for updates
          if (v.updated > state.virtualMachines[indexOfVm]['updated'] || v.volume_attach_compute.length !== state.virtualMachines[indexOfVm]['volume_attach_compute'].length) {
            state.virtualMachines[indexOfVm] = v
            delete v._meta
          }
        } else {
          // new vm found
          state.virtualMachines.push(v)
        }
      })
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalVmRecords = payload['x-total-count']
    },
    RESET (state) {
      state.virtualMachines = []
    },
    UPDATE_ONE (state, { computeId, updates }) {
      let indexOfVm = state.virtualMachines.findIndex(v => v.id === computeId)
      // state.virtualMachines[indexOfVm] = Object.assign({}, state.virtualMachines[indexOfVm], updates)
      if (indexOfVm === -1) {
        // we don't have element now lets return
        return
      }
      state.virtualMachines[indexOfVm] = _.merge({}, state.virtualMachines[indexOfVm], updates)
      state.virtualMachines.splice(indexOfVm, 1, state.virtualMachines[indexOfVm])
    },
    SET_SNAPSHOT (state, computeId, payload) {
      let indexOfVm = state.virtualMachines.findIndex(i => i.id === computeId)
      payload.forEach(v => {
        if (indexOfVm > -1) {
          let vm = state.virtualMachines[indexOfVm]
          if (vm.hasOwnProperty('_meta') && vm['_meta'].hasOwnProperty('snapshots')) {
            this.$set(vm['_meta']['snapshots'], v)
          }
        }
      })
    },
    ADD_ONE (state, payload) {
      state.virtualMachines.push(payload)
    }
  },

  actions: {
    LIST (context, payload) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-list', msg: 'Fetching Virtual Machines !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      // return your ajax request as promise
      return ComputesApi.listComputes(providerId, projectId, payload)
        .then(virtualMachines => {
          context.commit('SET', virtualMachines.data)
          context.commit('SET_TOTAL_COUNT', virtualMachines.headers)
          return context.state.virtualMachines
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-list' }, { root: true })
        })
    },

    GET_ONE (context, payload) {
      // Check if Virtual Machine is present in store. If present then return it.
      let computeId = Number.parseInt(payload.compute_id)
      let indexOfVm = context.state.virtualMachines.findIndex(v => v.id === computeId)
      if (indexOfVm !== -1) {
        return context.state.virtualMachines[indexOfVm]
      }

      context.dispatch('loader/addMessage', { type: 'virtual-machine-details', msg: 'Fetching Virtual Machine Details!' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      // return your ajax request as promise
      return ComputesApi.getCompute(providerId, projectId, computeId)
        .then(vm => {
          context.commit('ADD_ONE', vm)
          return vm
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-details' }, { root: true })
        })
    },

    DETAILS (context, computeId) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-details', msg: 'Fetching Virtual Machine Details!' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      // return your ajax request as promise
      return ComputesApi.getCompute(providerId, projectId, computeId)
        .then(virtualMachine => {
          return virtualMachine
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-details' }, { root: true })
        })
    },

    STATUS (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id

      context.dispatch('loader/addMessage', { type: 'virtual-machine-action-status', msg: 'Fetching Status !' }, { root: true })
      return ComputesApi.performAction(providerId, projectId, computeId, 'status')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-action-status' }, { root: true })
        })
    },

    SOCKET_STATUS (context, { taskId }) {
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

    STOP (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-stop', msg: 'Stoping Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'stop')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-stop' }, { root: true })
        })
    },

    START (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'virtual-machine-start', msg: 'Starting Virtual Machine !' }, { root: true })
      return ComputesApi.performAction(providerId, projectId, computeId, 'start')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-start' }, { root: true })
        })
    },

    PAUSE (context, payload) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-pause', msg: 'Stoping Virtual Machine !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'pause')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-pause' }, { root: true })
        })
    },

    UNPAUSE (context, payload) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-unpause', msg: 'Stoping Virtual Machine !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'unpause')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-unpause' }, { root: true })
        })
    },

    REBUILD (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-rebuild', msg: 'Stoping Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'rebuild')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-rebuild' }, { root: true })
        })
    },

    RESTART (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-restart', msg: 'Restarting Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'reboot')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-restart' }, { root: true })
        })
    },

    HARD_RESTART (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-hard-restart', msg: 'Restarting Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'hard_reboot')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-hard-restart' }, { root: true })
        })
    },

    CONFIRM_RESIZE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-resize-confirm', msg: 'Confirming Resize of Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'confirm_server_resize')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-resize-confirm' }, { root: true })
        })
    },

    REVERT_RESIZE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-resize-confirm', msg: 'Confirming Resize of Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ComputesApi.performAction(providerId, projectId, computeId, 'revert_server_resize')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-resize-confirm' }, { root: true })
        })
    },

    RESIZE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.computeId
      let flavorId = payload.flavorId
      context.dispatch('loader/addMessage', { type: 'virtual-machine-resize', msg: 'Resizing Virtual Machine !' }, { root: true })
      return ComputesApi.resizeComputes(providerId, projectId, computeId, flavorId)
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-resize' }, { root: true })
        })
    },

    CREATE (context, payload) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-create', msg: 'Creating Virtual Machine !' }, { root: true })
      const vm = createVirtualMachine(payload)
      var pl = vm.toJson()
      return ComputesApi.createCompute(pl)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-create' }, { root: true })
        })
    },

    DELETE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'virtual-machine-delete', msg: 'Deleting Virtual Machine !' }, { root: true })
      return ComputesApi.deleteCompute(providerId, projectId, computeId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-delete' }, { root: true })
        })
    },

    CONSOLE_LOGS (context, { providerId, projectId, computeId, lines }) {
      return ComputesApi.getLogs(providerId, projectId, computeId, lines)
        .then(response => {
          return response
        })
        .finally(() => {})
    },

    CONSOLE_URL (context, { providerId, projectId, computeId }) {
      return ComputesApi.getConsoleUrl(providerId, projectId, computeId)
        .then(response => {
          return response
        })
        .finally(() => {})
    },

    UPDATE_LOCAL_STORE (context, data) {
      context.commit('UPDATE_ONE', data)
      return Promise.resolve()
    },

    LIST_SNAPSHOTS (context, { computeId }) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-snapshot-list', msg: 'Fetching Snapshots !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      return SnapshotApi.list(providerId, projectId, computeId)
        .then(result => {
          // context.commit('SET', result)
          return result
        })
        .catch(error => {
          console.log('An error occurred while fetching volumes. Error response : ' + error.message)
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-snapshot-list' }, { root: true })
        })
    },

    CREATE_SNAPSHOT (context, { computeId, snapshotName }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'virtual-machine-snapshot-create', msg: 'Creating Snapshot !' }, { root: true })
      let payload = {
        'provider_id': providerId,
        'project_id': projectId,
        'compute_id': computeId,
        'snapshot_name': snapshotName
      }
      return SnapshotApi.create(providerId, projectId, computeId, payload)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-snapshot-create' }, { root: true })
        })
    },

    FILTER (context, payload) {
      context.dispatch('loader/addMessage', { type: 'virtual-machine-search', msg: 'Searching Virtual Machines !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      // return your ajax request as promise
      return ComputesApi.searchComputes(providerId, projectId, payload)
        .then(virtualMachines => {
          context.commit('SET', virtualMachines.data)
          context.commit('SET_TOTAL_COUNT', virtualMachines.headers)
          return context.state.virtualMachines
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-search' }, { root: true })
        })
    },

    SEARCH (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      return ComputesApi.searchComputes(providerId, projectId, payload)
        .then(virtualMachines => {
          return virtualMachines.data
        })
    }
  },

  getters: {
    virtualMachines (state) {
      return state.virtualMachines
    },

    totalVmRecords (state) {
      return state.totalVmRecords
    },

    virtualMachineById (state) {
      return (computeId) => {
        // return state.virtualMachines.filter(vm => vm.id === parseInt(computeId))
        return _.find(state.virtualMachines, ['id', parseInt(computeId)])
      }
    }
  }
}
