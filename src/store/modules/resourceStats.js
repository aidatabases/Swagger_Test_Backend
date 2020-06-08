import ResourceStatsApi from '@/api/ResourceStats'

export default {
  namespaced: true,

  state: {
    stats: {},
    organisationId: null,
    providerId: null
  },

  mutations: {
    SET_STATS (state, { stats, organisationId, providerId }) {
      state.stats = stats
      state.organisationId = organisationId
      state.providerId = providerId
    },
    RESET (state) {
      state.stats = {}
      state.organisationId = null
      state.providerId = null
    }
  },

  actions: {
    stats (context, { organisationId, providerId }) {
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'resource-stats', msg: 'Loading Organisation Limits !' }, { root: true })
      return ResourceStatsApi.getStats(organisationId, providerId)
        .then(stats => {
          context.commit('SET_STATS', { 'stats': stats, 'organisationId': organisationId, 'providerId': providerId })
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'resource-stats' }, { root: true })
        })
    }
  },

  getters: {
    stats (state) {
      return state.stats
    },
    statsForOrganisationId (state) {
      return state.organisationId
    },
    statsForProviderId (state) {
      return state.providerId
    },
    statsByName (state) {
      return (name) => {
        return state.stats['name']
      }
    }
  }
}
