import ProvidersApi from '@/api/Providers'
import _ from 'lodash'
import store from 'vuex-store'

export default {
  namespaced: true,

  state: {
    providers: [],
    availableProviders: []
  },

  mutations: {
    SET_PROVIDERS (state, providers) {
      state.providers = providers
    },
    SET_AVAILABLE_PROVIDERS (state, availableProviders) {
      state.availableProviders = availableProviders
    },
    SET_PROVIDER (state, provider) {
      state.providers = _.chain(state.providers).filter((_el) => _el.id !== provider.id).push(provider).value()
    },
    RESET (state) {
      state.providers = []
    }
  },

  actions: {
    LIST (context, config) {
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'providers-list', msg: 'Loading Providers !' }, { root: true })
      return ProvidersApi.listProviders()
        .then(providers => {
          context.commit('SET_PROVIDERS', providers)
          return providers
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'providers-list' }, { root: true })
        })
    },
    details (context, { providerId }) {
      context.dispatch('loader/addMessage', { type: 'provider-details', msg: 'Fetching provider Details !' }, { root: true })
      return ProvidersApi.getProvider(providerId)
        .then(provider => {
          context.commit('SET_PROVIDER', provider)
          return provider
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'provider-details' }, { root: true })
        })
    },
    listAvailableProviders (context, payload) {
      context.dispatch('loader/addMessage', { type: 'available-provider-list', msg: 'Fetching available provider list !' }, { root: true })
      return ProvidersApi.listAvailableProviders(payload)
        .then(providers => {
          context.commit('SET_AVAILABLE_PROVIDERS', providers)
          return providers
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'available-provider-list' }, { root: true })
        })
    }
  },

  getters: {
    getSelectedProviderName (state, getters) {
      if (getters.getSelectedProvider) {
        return getters.getSelectedProvider['provider_name']
      }
      return ''
    },

    getSelectedProvider (state, getters, rootState, rootGetters) {
      return getters.providerById(rootGetters['auth/selectedProvider'])
    },

    providers (state) {
      return state.providers
    },

    availableProviders (state) {
      return state.availableProviders
    },

    providerById (state) {
      return (providerId) => {
        if (_.some(state.providers, { id: providerId })) {
          return Promise.resolve(_.find(state.providers, { id: providerId }))
        } else {
          // trigger update and cache the result
          return store.cache.dispatch('providers/details', { 'providerId': providerId })
        }
      }
    },

    getSelectedProviderId (state, getters, rootState, rootGetters) {
      return rootGetters['auth/selectedProvider']
    },

    selectedProviderHashId (state, getters) {
      let providerId = getters.getSelectedProviderId
      if (_.some(state.providers, { id: providerId })) {
        let provider = _.find(state.providers, { id: providerId })
        return provider.provider_id
      } else {
        return ''
      }
    }
  }
}
