import store from 'vuex-store'
import { socket } from '@/utils/Socket'
import LoadBalancersApi from '@/api/LoadBalancers'
import _ from 'lodash'

export default {
  namespaced: true,
  strict: true,

  state: {
    loadBalancers: [],
    totalRecords: 0
  },

  mutations: {
    SET (state, payload) {
      state.loadBalancers = payload
    },
    RESET (state) {
      state.loadBalancers = []
    },
    ADD_ONE (state, payload) {
      state.loadBalancers.push(payload)
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalRecords = (payload && !!payload['x-total-count']) ? parseInt(payload['x-total-count'], 10) : 0
    }
  },

  actions: {
    list (context, payload) {
      context.dispatch('loader/addMessage', { type: 'lb-list', msg: 'Fetching Load Balancers !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      return LoadBalancersApi.list(providerId, projectId, payload)
        .then(lbs => {
          context.commit('SET', lbs.data)
          context.commit('SET_TOTAL_COUNT', lbs.headers)
          return lbs.data
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'lb-list' }, { root: true })
        })
    },
    getOne (context, { lbId }) {
      // Check if LoadBalancer is present in store. If present then return it.
      let loadBalancerId = Number.parseInt(lbId)
      let indexOfLb = context.state.loadBalancers.findIndex(i => i.id === loadBalancerId)
      if (indexOfLb !== -1) {
        return context.state.loadBalancers[indexOfLb]
      }

      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']

      context.dispatch('loader/addMessage', { type: 'load-balancer-details', msg: 'Fetching Load Balancer Details.' }, { root: true })
      // return your ajax request as promise
      return LoadBalancersApi.getLoadBalancer(providerId, projectId, loadBalancerId)
        .then(lb => {
          context.commit('ADD_ONE', lb)
          return lb
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'load-balancer-details' }, { root: true })
        })
    },
    create (context, { providerId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'lb-create', msg: 'Creating Load Balancer !' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      return LoadBalancersApi.create(providerId, projectId, payload)
        .then(res => {
          return res
        })
        .finally(() => {
          store.cache.delete('loadBalancers/list', {})
          context.dispatch('loader/removeMessage', { type: 'lb-create' }, { root: true })
        })
    },
    delete (context, lbId) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'load-balancer-delete', msg: 'Please wait. Deleting LoadBalancer.' }, { root: true })
      return LoadBalancersApi.delete(providerId, projectId, lbId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'load-balancer-delete' }, { root: true })
        })
    },
    status (context, { taskId }) {
      if (!taskId) {
        return Promise.reject(new Error('Invalid Task Id'))
      }
      socket.emit('join_room', { 'taskId': taskId })
      let promise = new Promise(function (resolve, reject) {
        socket.on(taskId, ({ data }) => {
          store.cache.delete('loadBalancers/list', {})
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
    }
  },

  getters: {
    loadBalancers (state) {
      return state.loadBalancers
    },
    loadBalancerById (state) {
      return (lbId) => {
        return _.find(state.loadBalancers, ['id', parseInt(lbId)])
      }
    },
    totalRecords (state) {
      return state.totalRecords
    }
  }
}
