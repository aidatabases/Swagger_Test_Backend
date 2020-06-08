import store from 'vuex-store'
import RolesApi from '@/api/UserRoles'
import _ from 'lodash'

export default {
  namespaced: true,
  strict: true,

  state: {
    userRoles: []
  },
  mutations: {
    SET (state, payload) {
      state.userRoles = payload
    },
    RESET (state) {
      state.userRoles = []
    }
  },
  actions: {
    list ({ commit, rootGetters, dispatch }) {
      var organisationId = rootGetters['auth/selectedOrganisation']
      dispatch('loader/addMessage', { type: 'role-list', msg: 'Fetching User Roles !' }, { root: true })
      return RolesApi.listRoles(organisationId)
        .then(userRoles => {
          commit('SET', userRoles)
        })
        .catch((error) => {
          console.log('Error fetching User Roles ' + JSON.stringify(error))
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'role-list' }, { root: true })
        })
    },
    create (context, { payload }) {
      return RolesApi.createRole(payload)
        .then(role => {
          return role
        })
        .catch((error) => {
          console.log('Create role Error: ' + JSON.stringify(error))
        })
        .finally(() => {
          store.cache.delete('userRoles/list', {})
          store.cache.dispatch('userRoles/list', {})
        })
    }
  },
  getters: {
    userRoles (state, getters, rootState, rootGetters) {
      return state.userRoles
    },
    userRoleById (state) {
      return (id) => {
        return _.find(state.userRoles, ['id', id])
      }
    }
  }
}
