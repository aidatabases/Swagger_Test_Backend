import _ from 'lodash'
import SecurityGroupsApi from '@/api/SecurityGroups'
import { socket } from '@/utils/Socket'
import store from 'vuex-store'

export default {
  namespaced: true,

  state: {
    securityGroups: [],
    totalSecurityGroupsRecords: 0
  },

  mutations: {
    SET_SECURITY_GROUPS (state, payload) {
      state.securityGroups = payload
    },
    ADD_ONE (state, payload) {
      state.securityGroups.push(payload)
    },
    REMOVE_ONE (state, sgId) {
      let indexOfSg = state.securityGroups.findIndex(i => i.id === sgId)
      if (indexOfSg > -1) {
        state.securityGroups.splice(indexOfSg, 1)
      }
    },
    RESET (state) {
      state.securityGroups = []
      state.totalSecurityGroupsRecords = 0
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalSecurityGroupsRecords = (payload && !!payload['x-total-count']) ? parseInt(payload['x-total-count'], 10) : 0
    }
  },

  actions: {
    status (context, { taskId }) {
      if (!taskId) {
        return Promise.reject(new Error('Invalid Task Id'))
      }
      socket.emit('join_room', { 'taskId': taskId })
      let promise = new Promise(function (resolve, reject) {
        socket.on(taskId, ({ data }) => {
          store.cache.delete('securityGroups/list', {})
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

    list (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let storeResult = payload['storeResult']

      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'list-security-groups', msg: 'Fetching your security groups !' }, { root: true })
      return SecurityGroupsApi.listSecurityGroups(providerId, projectId, payload)
        .then(securityGroups => {
          if (storeResult) {
            context.commit('SET_SECURITY_GROUPS', securityGroups.data)
            context.commit('SET_TOTAL_COUNT', securityGroups.headers)
          }
          return securityGroups.data
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'list-security-groups' }, { root: true })
        })
    },

    getOne (context, { sgId }) {
      debugger
      // Check if Scaling Group is present in store. If present then return it.
      let scalingGroupId = Number.parseInt(sgId)
      let indexOfSg = context.state.securityGroups.findIndex(i => i.id === scalingGroupId)
      if (indexOfSg !== -1) {
        return context.state.securityGroups[indexOfSg]
      }

      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      context.dispatch('loader/addMessage', { type: 'security-group-details', msg: 'Fetching Security Group Details.' }, { root: true })
      // return your ajax request as promise
      return SecurityGroupsApi.getSecurityGroup(providerId, projectId, scalingGroupId)
        .then(sg => {
          context.commit('ADD_ONE', sg)
          return sg
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'security-group-details' }, { root: true })
        })
    },

    create (context, { payload }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'add-security-groups', msg: 'Fetching security groups !' }, { root: true })
      return SecurityGroupsApi.createSecurityGroup(providerId, projectId, payload)
        .then(response => {
          return response
        }).finally(() => {
          context.dispatch('loader/removeMessage', { type: 'add-security-groups' }, { root: true })
        })
    },

    delete (context, { sgId }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'delete-security-groups', msg: 'Please wait. Deleting security groups !' }, { root: true })
      return SecurityGroupsApi.deleteSecurityGroup(providerId, projectId, sgId)
        .then(response => {
          context.commit('REMOVE_ONE', response.security_group_id)
          return response
        }).finally(() => {
          context.dispatch('loader/removeMessage', { type: 'delete-security-groups' }, { root: true })
        })
    }
  },
  getters: {
    securityGroups (state) {
      return state.securityGroups
    },
    securityGroupById (state) {
      return (securityGroupId) => {
        return _.find(state.securityGroups, ['id', parseInt(securityGroupId)])
      }
    },
    totalSecurityGroupsRecords (state) {
      return state.totalSecurityGroupsRecords
    }
  }
}
