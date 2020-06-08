import _ from 'lodash'
import Vue from 'vue'
import ScalingGroupsApi from '@/api/ScalingGroups'
import { socket } from '@/utils/Socket'

export default {
  namespaced: true,

  state: {
    scalingGroups: [],
    scalingGroupComputes: [],
    totalRecords: 0
  },

  mutations: {
    SET_SCALING_GROUPS (state, payload) {
      // Remove deleted/non existing scaling groups
      let idsOfNonExistingScalingGroups = _.difference(_.map(state.scalingGroups, 'id'), _.map(payload, 'id'))
      idsOfNonExistingScalingGroups.forEach(id => {
        let indexOfSg = state.scalingGroups.findIndex(i => i.id === id)
        state.scalingGroups.splice(indexOfSg, 1)
      })

      payload.forEach(v => {
        let indexOfSg = state.scalingGroups.findIndex(i => i.id === v.id)
        if (indexOfSg > -1) {
          // we do have this SG, checking for updates
          Vue.set(state.scalingGroups, indexOfSg, v)
        } else {
          // new sg found
          state.scalingGroups.push(v)
        }
      })
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalRecords = (payload && !!payload['x-total-count']) ? parseInt(payload['x-total-count'], 10) : 0
    },
    SET_SCALING_GROUP_VM (state, { scalingGroupId, computes }) {
      let idsOfNonExistingScalingGroupComputes = _.difference(_.map(state.scalingGroupComputes, 'id'), _.map(computes, 'id'))
      idsOfNonExistingScalingGroupComputes.forEach(id => {
        let indexOfCompute = state.scalingGroupComputes.findIndex(i => i.id === id)
        state.scalingGroupComputes.splice(indexOfCompute, 1)
      })

      computes.forEach(v => {
        v.scaling_group_id = scalingGroupId
        let indexOfCompute = state.scalingGroupComputes.findIndex(i => i.id === v.id)
        if (indexOfCompute > -1) {
          // we do have this Computes, checking for updates
          Vue.set(state.scalingGroupComputes, indexOfCompute, v)
        } else {
          state.scalingGroupComputes.push(v)
        }
      })
    },
    RESET (state) {
      state.scalingGroups = []
      state.scalingGroupComputes = []
    },
    UPDATE_ONE (state, { scalingGroupId, updates }) {
      let indexOfScalingGroup = state.scalingGroups.findIndex(v => v.id === scalingGroupId)
      state.scalingGroups[indexOfScalingGroup] = Object.assign({}, state.scalingGroups[indexOfScalingGroup], updates)
      state.scalingGroups.splice(indexOfScalingGroup, 1, state.scalingGroups[indexOfScalingGroup])
    },
    UPDATE_ONE_COMPUTE (state, { computeId, updates }) {
      let indexOfCompute = state.scalingGroupComputes.findIndex(v => v.id === computeId)
      state.scalingGroupComputes[indexOfCompute] = Object.assign({}, state.scalingGroupComputes[indexOfCompute], updates)
      state.scalingGroupComputes.splice(indexOfCompute, 1, state.scalingGroupComputes[indexOfCompute])
    }
  },

  actions: {
    list (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      context.dispatch('loader/addMessage', { type: 'list-scaling-groups', msg: 'Fetching scaling groups !' }, { root: true })
      return ScalingGroupsApi.listScalingGroups(providerId, projectId, payload)
        .then(scalingGroups => {
          context.commit('SET_SCALING_GROUPS', scalingGroups.data)
          context.commit('SET_TOTAL_COUNT', scalingGroups.headers)
          return scalingGroups.data
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'list-scaling-groups' }, { root: true })
        })
    },

    details (context, { providerId, projectId, scalingGroupId }) {
      context.dispatch('loader/addMessage', { type: 'scaling-details-details', msg: 'Fetching Virtual Machine Details!' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      // return your ajax request as promise
      return ScalingGroupsApi.getDetails(providerId, projectId, scalingGroupId)
        .then(res => {
          return res
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'scaling-details-details' }, { root: true })
        })
    },

    computeList (context, { scalingGroupId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'list-compute-details', msg: 'Fetching compute details !' }, { root: true })
      return ScalingGroupsApi.listComputes(providerId, projectId, scalingGroupId)
        .then(computes => {
          context.commit('SET_SCALING_GROUP_VM', { scalingGroupId, computes })
          return computes
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'list-compute-details' }, { root: true })
        })
    },

    delete (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let scalingGroupId = payload.scalingGroupId
      context.dispatch('loader/addMessage', { type: 'delete-scaling-group', msg: 'Deleting scaling group!' }, { root: true })
      return ScalingGroupsApi.deleteScalingGroup(providerId, projectId, scalingGroupId)
        .then(response => {
          console.log(`${JSON.stringify(response)}`)
          return response
        }).finally(() => {
          context.dispatch('loader/removeMessage', { type: 'delete-scaling-group' }, { root: true })
        })
    },

    create (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let postData = {
        'name': payload.name,
        'image_id': payload.image,
        'flavor_id': payload.flavor,
        'network_id': payload.network,
        'sec_group_id': payload.securityGroups,
        'userdata': '',
        'vm_password': payload.password,
        'vm_confirm_password': payload.password,
        'vm_username': payload.vMUserName,
        'private_network': '',
        'public_network': '',
        'cluster_size': payload.clusterSize,
        'provider_id': providerId,
        'project_id': projectId
      }

      context.dispatch('loader/addMessage', { type: 'create-scaling-groups', msg: 'Creating Scaling Group...' }, { root: true })
      return ScalingGroupsApi.createScalingGroup(providerId, projectId, postData)
        .then(response => {
          console.log(`${JSON.stringify(response)}`)
        }).finally(() => {
          context.dispatch('loader/removeMessage', { type: 'create-scaling-groups' }, { root: true })
        })
    },

    resize (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let scalingGroupId = payload.scalingGroupId
      let postData = payload.data
      context.dispatch('loader/addMessage', { type: 'virtual-machine-resize', msg: 'Resizing Scaling Group !' }, { root: true })
      return ScalingGroupsApi.resizeScalingGroup(providerId, projectId, scalingGroupId, postData)
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'virtual-machine-resize' }, { root: true })
        })
    },

    UPDATE_LOCAL_STORE (context, data) {
      context.commit('UPDATE_ONE', data)
      return Promise.resolve()
    },

    UPDATE_COMPUTE_LOCAL_STORE (context, data) {
      context.commit('UPDATE_ONE_COMPUTE', data)
      return Promise.resolve()
    },

    status (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id

      context.dispatch('loader/addMessage', { type: 'scaling-group-compute-action-status', msg: 'Fetching Status !' }, { root: true })
      return ScalingGroupsApi.performAction(providerId, projectId, computeId, 'status')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'scaling-group-compute-action-status' }, { root: true })
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

    RESET (state) {
      state.scalingGroups = []
    },

    START_COMPUTE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'scaling-group-compute-start', msg: 'Starting Virtual Machine !' }, { root: true })
      return ScalingGroupsApi.performAction(providerId, projectId, computeId, 'start')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'scaling-group-compute-start' }, { root: true })
        })
    },

    STOP_COMPUTE (context, payload) {
      let projectId = context.rootGetters['auth/selectedProject']
      let providerId = context.rootGetters['auth/selectedProvider']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'scaling-group-compute-stop', msg: 'Stoping Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ScalingGroupsApi.performAction(providerId, projectId, computeId, 'stop')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'scaling-group-compute-stop' }, { root: true })
        })
    },

    RESTART_COMPUTE (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload.compute_id
      context.dispatch('loader/addMessage', { type: 'scaling-group-compute-restart', msg: 'Restarting Virtual Machine !' }, { root: true })
      // return your ajax request as promise
      return ScalingGroupsApi.performAction(providerId, projectId, computeId, 'reboot')
        .then(state => {
          return state
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'scaling-group-compute-restart' }, { root: true })
        })
    }
  },
  getters: {
    scalingGroups (state) {
      return state.scalingGroups
    },
    scalingGroupById (state) {
      return (scalingGroupId) => {
        return _.find(state.scalingGroups, ['id', parseInt(scalingGroupId)])
      }
    },
    computes (state) {
      return state.scalingGroupComputes
    },
    computeById (state) {
      return (computeId) => {
        return _.find(state.scalingGroupComputes, ['id', parseInt(computeId)])
      }
    },
    computesByScalingGroupId (state) {
      return (scalingGroupId) => {
        return _.filter(state.scalingGroupComputes, ['scaling_group_id', parseInt(scalingGroupId)])
      }
    },
    totalRecords (state) {
      return state.totalRecords
    }
  }
}
