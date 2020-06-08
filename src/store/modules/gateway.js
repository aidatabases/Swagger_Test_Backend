import store from 'vuex-store'
import GatewayApi from '@/api/Gateway'

export default {
  namespaced: true,

  state: {
    gateway: {},
    services: []
  },

  mutations: {
    SET_GATEWAY (state, payload) {
      state.gateway = payload
    },
    SET_SERVICES (state, payload) {
      state.services = payload
    },
    RESET (state) {
      state.gateway = {}
      state.services = []
    }
  },

  actions: {
    createService (context, { providerId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'gateway-service-create', msg: 'Creating Gateway Service !' }, { root: true })
      return GatewayApi.createService(providerId, projectId, payload)
        .finally(() => {
          store.cache.delete('gateway/listServices', {})
          store.cache.dispatch('gateway/listServices', {})
          store.cache.delete('securityGroupRules/list', { securityGroupId: context.state.gateway.security_group_id })
          store.cache.dispatch('securityGroupRules/list', { securityGroupId: context.state.gateway.security_group_id })
          context.dispatch('loader/removeMessage', { type: 'gateway-service-create' }, { root: true })
        })
    },

    listServices (context, { providerId, projectId }) {
      context.dispatch('loader/addMessage', { type: 'gateway-service-list', msg: 'Loading Gateway Services !' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }

      // return your ajax request as promise
      return GatewayApi.listServices(providerId, projectId)
        .then(services => {
          context.commit('SET_SERVICES', services)
          return services
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'gateway-service-list' }, { root: true })
        })
    },

    details (context, { providerId, projectId }) {
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      if (!projectId || !providerId) {
        return Promise.reject(new Error('No project and provider Details'))
      }
      context.dispatch('loader/addMessage', { type: 'gateway-details', msg: 'Loading Gateway Details !' }, { root: true })

      // return your ajax request as promise
      return GatewayApi.getDetails(providerId, projectId)
        .then(gateway => {
          context.commit('SET_GATEWAY', gateway)
          return gateway
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'gateway-details' }, { root: true })
        })
    },

    stopService (context, { projectId, providerId, gatewayServiceId }) {
      context.dispatch('loader/addMessage', { type: 'gateway-service-stop', msg: 'Stopping Gateway Service !' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      // return your ajax request as promise
      return GatewayApi.performAction(providerId, projectId, gatewayServiceId, 'stop')
        .then(state => {
          return state
        })
        .finally(() => {
          store.cache.delete('gateway/listServices', {})
          store.cache.dispatch('gateway/listServices', {})
          context.dispatch('loader/removeMessage', { type: 'gateway-service-stop' }, { root: true })
        })
    },

    startService (context, { projectId, providerId, gatewayServiceId }) {
      context.dispatch('loader/addMessage', { type: 'gateway-service-start', msg: 'Starting Gateway Service !' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      // return your ajax request as promise
      return GatewayApi.performAction(providerId, projectId, gatewayServiceId, 'start')
        .then(state => {
          return state
        })
        .finally(() => {
          store.cache.delete('gateway/listServices', {})
          store.cache.dispatch('gateway/listServices', {})
          context.dispatch('loader/removeMessage', { type: 'gateway-service-start' }, { root: true })
        })
    },

    removeService (context, { projectId, providerId, gatewayServiceId }) {
      context.dispatch('loader/addMessage', { type: 'gateway-service-remove', msg: 'Removing Gateway Service !' }, { root: true })
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      // return your ajax request as promise
      return GatewayApi.performAction(providerId, projectId, gatewayServiceId, 'remove')
        .then(state => {
          return state
        })
        .finally(() => {
          store.cache.delete('gateway/listServices', {})
          store.cache.dispatch('gateway/listServices', {})
          store.cache.delete('securityGroupRules/list', { securityGroupId: context.state.gateway.security_group_id })
          store.cache.dispatch('securityGroupRules/list', { securityGroupId: context.state.gateway.security_group_id })
          context.dispatch('loader/removeMessage', { type: 'gateway-service-remove' }, { root: true })
        })
    }
  },

  getters: {
    gateway (state) {
      return state.gateway
    },
    services (state) {
      return state.services
    },
    gatewayIp (state) {
      return state.gateway.gw_device_ip
    }
  }
}
