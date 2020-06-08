import _ from 'lodash'
import store from 'vuex-store'
import UsersApi from '@/api/Users'

export default {
  namespaced: true,
  strict: true,

  state: {
    users: []
  },
  mutations: {
    SET (state, payload) {
      state.users = payload
    },
    RESET (state) {
      state.users = []
    },
    SET_USER (state, user) {
      user['is_detailed'] = true
      state.users = _.chain(state.users).filter((_el) => _el.id !== user.id).push(user).value()
    }

  },
  actions: {
    LIST ({ commit }) {
      return UsersApi.listUsers()
        .then(users => {
          commit('SET', users)
        })
        .catch((error) => {
          console.log('Error fetching user list ' + JSON.stringify(error))
        })
        .finally(() => {
        })
    },

    CREATE (context, { payload, organisationId }) {
      context.dispatch('loader/addMessage', { type: 'user-create', msg: 'Creating User !' }, { root: true })
      return UsersApi.createUser(organisationId, payload)
        .then(user => {
          return user
        })
        .catch((error) => {
          console.log('Create User Error: ' + JSON.stringify(error))
        })
        .finally(() => {
          store.cache.delete('users/LIST', {})
          store.cache.dispatch('users/LIST', {})
          context.dispatch('loader/removeMessage', { type: 'user-create' }, { root: true })
        })
    },

    details (context, { userId }) {
      context.dispatch('loader/addMessage', { type: 'user-details', msg: 'Fetching User Details !' }, { root: true })
      return UsersApi.getUser(userId)
        .then(user => {
          context.commit('SET_USER', user)
          return user
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'user-details' }, { root: true })
        })
    }

  },
  getters: {
    users (state, getters, rootState, rootGetters) {
      return state.users
    },
    userById (state) {
      return (userId) => {
        if (_.some(state.users, { id: userId, is_detailed: true })) {
          return Promise.resolve(_.find(state.users, { id: userId, is_detailed: true }))
        } else {
          // trigger update and cache the result
          return store.dispatch('users/details', { 'userId': userId })
        }
      }
    }
  }
}
