import _ from 'lodash'
import UserRoleScopesApi from '@/api/UserRoleScopes'

export default {
  namespaced: true,
  strict: true,

  state: {
    userRoleScopes: {}
  },
  mutations: {
    SET (state, payload) {
      state.userRoleScopes = payload
    },
    RESET (state) {
      state.userRoleScopes = []
    }
  },
  actions: {
    list ({ commit }) {
      return UserRoleScopesApi.getScopes()
        .then(userRoleScopes => {
          commit('SET', userRoleScopes)
        })
        .catch((error) => {
          console.log('Error fetching User roles list ' + JSON.stringify(error))
        })
        .finally(() => {
        })
    }
  },
  getters: {
    userRoleScopes (state, getters, rootState, rootGetters) {
      return state.userRoleScopes
    },
    scopeHeads (state) {
      return state.userRoleScopes.scope_list ? _.chain(state.userRoleScopes.scope_list)
        .map((s) => {
          return s.split(':')[0]
        })
        .uniq()
        .value() : []
    }
  }
}
