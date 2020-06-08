import store from 'vuex-store'
import NetworksApi from '@/api/Networks'

export default {
  namespaced: true,

  state: {
    networks: [],
    totalRecords: 0
  },

  mutations: {
    SET_NETWORKS (state, payload) {
      state.networks = payload
    },
    RESET (state) {
      state.networks = []
    },
    SET_TOTAL_COUNT (state, payload) {
      state.totalRecords = (payload && !!payload['x-total-count']) ? parseInt(payload['x-total-count'], 10) : 0
    }
  },

  actions: {
    list (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'networks-list', msg: 'Fetching associated networks !' }, { root: true })
      return NetworksApi.listNetworks(providerId, projectId, payload)
        .then(networks => {
          context.commit('SET_NETWORKS', networks.data)
          context.commit('SET_TOTAL_COUNT', networks.headers)
          return networks.data
        })
        .finally(() => {
          store.cache.delete('networks/list', {})
          context.dispatch('loader/removeMessage', { type: 'networks-list' }, { root: true })
        })
    },

    create (context, { providerId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'networks-create', msg: 'Please wait. Creating networks !' }, { root: true })
      return NetworksApi.createNetwork(providerId, projectId, payload)
        .then(networks => {
          return networks
        })
        .catch(error => console.log(error))
        .finally(() => {
          store.cache.delete('networks/list', {})
          store.cache.dispatch('networks/list', {})
          context.dispatch('loader/removeMessage', { type: 'networks-create' }, { root: true })
        })
    },

    createSubnet (context, { payload }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let networkId = payload['network_id']
      context.dispatch('loader/addMessage', { type: 'networks-create-subnet', msg: 'Please wait. Creating networks !' }, { root: true })
      return NetworksApi.createSubNetwork(providerId, projectId, networkId, payload)
        .then(networks => {
          return networks
        })
        .finally(() => {
          store.cache.delete('networks/list', {})
          store.cache.dispatch('networks/list', {})
          context.dispatch('loader/removeMessage', { type: 'networks-create-subnet' }, { root: true })
        })
    },

    getNetwork ({ commit }, { providerId, projectId, networkId }) {
      return NetworksApi.getNetwork(providerId, projectId, networkId)
        .then(network => {
          return network
        })
        .catch(error => console.log(error))
        .finally(() => {})
    },
    deleteSubnet (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let networkId = payload['networkId']
      let subnetId = payload['subnetId']
      context.dispatch('loader/addMessage', { type: 'delete-subnet-networks-list', msg: 'Deleting Subnet...' }, { root: true })
      return NetworksApi.deleteSubnet(providerId, projectId, networkId, subnetId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'delete-subnet-networks-list' }, { root: true })
        })
    },

    deleteNetwork (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let networkId = payload['networkId']
      context.dispatch('loader/addMessage', { type: 'delete-networks-list', msg: 'Deleting network...' }, { root: true })
      return NetworksApi.deleteNetwork(providerId, projectId, networkId)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'delete-networks-list' }, { root: true })
        })
    },

    attachNetwork (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload['compute_id']
      context.dispatch('loader/addMessage', { type: 'attach-networks-list', msg: 'Please wait attaching network...' }, { root: true })
      return NetworksApi.attachNetwork(providerId, projectId, computeId, payload)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'attach-networks-list' }, { root: true })
        })
    },

    detachNetwork (context, payload) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let computeId = payload['compute_id']
      let networkId = payload['network_id']
      context.dispatch('loader/addMessage', { type: 'detach-network', msg: 'Please wait detaching network...' }, { root: true })
      return NetworksApi.detachNetwork(providerId, projectId, computeId, networkId, payload)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'detach-network' }, { root: true })
        })
    }
  },

  getters: {
    networks (state) {
      return state.networks
    },
    internalNetworks (state) {
      return state.networks.filter(function (n) {
        return !n.external
      })
    },
    totalRecords (state) {
      return state.totalRecords
    }
  }
}
