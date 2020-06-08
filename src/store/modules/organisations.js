import OrganisationsApi from '@/api/Organisations'
import _ from 'lodash'
import store from 'vuex-store'

export default {
  namespaced: true,
  state: {
    organisations: []
  },

  mutations: {
    SET_ORGANISATION (state, organisation) {
      state.organisations = _.chain(state.organisations).filter((_el) => _el.id !== organisation.id).push(organisation).value()
    },
    SET_ORGANISATIONS (state, organisations) {
      state.organisations = organisations
    },
    RESET (state) {
      state.organisations = []
    }
  },

  actions: {
    details ({ dispatch, commit }, { organisationId }) {
      dispatch('loader/addMessage', { type: 'organisation-details', msg: 'Fetching Organisation Details !' }, { root: true })
      return OrganisationsApi.getOrganisation(organisationId)
        .then(organisation => {
          commit('SET_ORGANISATION', organisation)
          return organisation
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'organisation-details' }, { root: true })
        })
    }
  },
  getters: {
    getOrganisations (state) {
      return state.organisations
    },
    organisationById (state) {
      return (organisationId) => {
        if (_.some(state.organisations, { id: organisationId })) {
          return Promise.resolve(_.find(state.organisations, { id: organisationId }))
        } else {
          // trigger update and cache the result
          return store.cache.dispatch('organisations/details', { 'organisationId': organisationId })
        }
      }
    },
    getSelectedOrganisation (state, getters, rootState, rootGetters) {
      return getters.organisationById(rootGetters['auth/selectedOrganisation'])
    },
    getSelectedOrganisationId (state, getters, rootState, rootGetters) {
      return rootGetters['auth/selectedOrganisation']
    },
    selectedOrganisationHashId (state, getters) {
      let orgId = getters.getSelectedOrganisationId
      if (_.some(state.organisations, { id: orgId })) {
        let org = _.find(state.organisations, { id: orgId })
        return org.org_id
      } else {
        return ''
      }
    }
  }
}
