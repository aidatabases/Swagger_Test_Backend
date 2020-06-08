import ServerFarmsApi from '@/api/ServerFarms'

export default {
  namespaced: true,
  strict: true,

  state: {
    serverFarms: []
  },

  mutations: {
    SET (state, payload) {
      state.serverFarms = payload
    },
    ADD_ONE (state, payload) {
      state.serverFarms.push(payload)
    }
  },

  actions: {
    list (context, { lbId }) {
      context.dispatch('loader/addMessage', { type: 'server-farms-detail', msg: 'Fetching Server Farm Details !' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      return ServerFarmsApi.list(providerId, projectId, lbId)
        .then(data => {
          context.commit('SET', data)
          return data
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'server-farms-detail' }, { root: true })
        })
    },
    getOne (context, { farmId }) {
      // Check if ServerFarm is present in store. If present then return it.
      farmId = Number.parseInt(farmId)
      let indexOfServerFarm = context.state.serverFarms.findIndex(i => i.id === farmId)
      if (indexOfServerFarm !== -1) {
        return context.state.serverFarms[indexOfServerFarm]
      }

      /* let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      context.dispatch('loader/addMessage', { type: 'server-farm-details', msg: 'Fetching Server Farm Details.' }, { root: true })
      return ServerFarmsApi.getLoadBalancer(providerId, projectId, farmId)
        .then(res => {
          context.commit('ADD_ONE', res)
          return res
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'server-farm-details' }, { root: true })
        }) */
    },
    create (context, { providerId, projectId, lbId, payload }) {
      context.dispatch('loader/addMessage', { type: 'server-farms-create', msg: 'Creating Server Farms !' }, { root: true })
      return ServerFarmsApi.create(providerId, projectId, lbId, payload)
        .then(ResponseData => {
          return ResponseData
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'server-farms-create' }, { root: true })
        })
    },
    action (context, { lbId, sfId, action }) {
      context.dispatch('loader/addMessage', { type: 'server-farm-action', msg: 'Please wait..!' }, { root: true })
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      return ServerFarmsApi.action(providerId, projectId, lbId, sfId, action)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'server-farm-action' }, { root: true })
        })
    }
  },

  getters: {
    serverFarms (state) {
      return state.serverFarms
    }
  }
}
