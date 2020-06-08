import store from 'vuex-store'
import axios from 'axios'
import _ from 'lodash'
// import router from '@/router'
import AuthAPI from '@/api/Auth'
import UsersAPI from '@/api/Users'

export default {
  namespaced: true,

  state: {
    authDetails: {},
    userDetails: {},
    selectedDomain: {},
    userScopes: {},
    userRoles: {},
    showDomainSelectionModal: false
  },
  // Getters
  getters: {
    userScopes (state) {
      return state.userScopes
    },
    userRoles (state) {
      return state.userRoles
    },
    token (state) {
      return state.authDetails.access_token
    },
    showDomainSelectionModal (state) {
      return state.showDomainSelectionModal
    },
    user (state) {
      return state.userDetails
    },
    userId (state) {
      return state.userDetails.id
    },
    organisationId (state) {
      return state.selectedDomain['organisationId'] ? state.selectedDomain['organisationId'] : null
    },
    selectedDomain (state) {
      return state.selectedDomain
    },
    selectedProject (state) {
      return state.selectedDomain['projectId'] ? state.selectedDomain['projectId'] : null
    },
    selectedProvider (state) {
      return state.selectedDomain['providerId'] ? state.selectedDomain['providerId'] : null
    },
    selectedOrganisation (state) {
      return state.selectedDomain['organisationId'] ? state.selectedDomain['organisationId'] : null
    },
    availableDomains (state) {
      let domains = []
      !!state.userDetails.organisation_project_user_user &&
        _.forEach(state.userDetails.organisation_project_user_user, ({ organisation, project }) => {
          _.map(project.project_provider_mapping_project, (provider) => {
            domains.push({ projectId: project['id'], providerId: provider['provider_id'], organisationId: organisation['id'] })
          })
        })
      return domains
    },
    myScope (state) {
      return state.userScopes.scopes || []
    }
  },
  // Mutations
  mutations: {
    SET_AUTH_DETAILS (state, details) {
      state.authDetails = details
      // Object.assign({}, state.authDetails, details)
    },
    SET_USER_SCOPES (state, userScopes) {
      state.userScopes = userScopes
    },
    SET_USER_ROLES (state, userRoles) {
      state.userRoles = userRoles
    },
    SET_AUTH_HEADER (state, header) {
      axios.defaults.headers.common['authorization'] = `Bearer ${header}`
    },
    SET_DOMAIN_SELECTION_MODAL_VISIBILITY (state, visibility) {
      state.showDomainSelectionModal = visibility
    },
    SET_USER (state, details) {
      state.userDetails = details
    },
    SELECT_DOMAIN (state, domain) {
      state.selectedDomain = domain
    },
    RESET (state) {
      state.authDetails = {}
      state.userDetails = {}
      state.selectedDomain = {}
      state.userScopes = {}
      store.cache.clear()
    }
  },

  actions: {
    setLogoutTimer ({ commit }, expirationTime) {
      setTimeout(() => {
        commit('RESET')
      }, expirationTime)
    },
    autoLogin ({ commit, dispatch, getters }) {
      return dispatch('setHeaderToken', getters.token)
    },
    changeProjectScope ({ commit, dispatch, getters }, selectedDomain) {
      dispatch('loader/addMessage', { type: 'user-project-change', msg: 'Changing your project !' }, { root: true })
      var payload = {}
      payload['project_id'] = selectedDomain.projectId
      return AuthAPI.changeProjectScope(selectedDomain.projectId, payload)
        .then((scopes) => {
          commit('SET_USER_SCOPES', scopes)
        })
        .then(() => {
          commit('SELECT_DOMAIN', selectedDomain)
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'user-project-change' }, { root: true })
        })
    },

    validateOtp ({ commit, dispatch, getters }, { otp }) {
      return AuthAPI.validateOtp(otp)
        .then(() => {
          return dispatch('setUserDetails') // this will set available domains
        })
        .then(() => {
          return dispatch('setUserScopes')
        })
        .then(() => {
          return dispatch('setUserRoles')
        })
        .catch(error => {
          console.log('result error : ' + error)
          throw error['message']
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'user-login' }, { root: true })
        })
    },

    resendOtp ({ dispatch }) {
      dispatch('loader/addMessage', { type: 'resend-otp', msg: 'Sending new OTP..' }, { root: true })
      return AuthAPI.resendOtp()
        .then(res => {
          return res
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'resend-otp' }, { root: true })
        })
    },

    login ({ commit, dispatch, getters }, user) {
      user['client_id'] = user['username']
      // user['client_secret'] = user['password']
      dispatch('loader/addMessage', { type: 'user-login', msg: 'Logging you In !' }, { root: true })
      return AuthAPI.getToken(user)
        .then(authDetails => {
          // setting auth details
          commit('SET_AUTH_DETAILS', authDetails)
          dispatch('setLogoutTimer', authDetails.expires_in * 1000)
        })
        .then(() => {
          // setting token
          return dispatch('setHeaderToken', getters.token)
        })
        .catch(error => {
          console.log('result error : ' + error)
          throw error
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'user-login' }, { root: true })
        })
    },
    showDomainSelectionModal ({ commit }) {
      commit('SET_DOMAIN_SELECTION_MODAL_VISIBILITY', Math.floor(Math.random() * Math.floor(10000)))
    },
    setHeaderToken ({ commit }, token) {
      commit('SET_AUTH_HEADER', token)
      return Promise.resolve()
    },
    setUserScopes ({ commit, dispatch, getters }, user) {
      dispatch('loader/addMessage', { type: 'user-scopes', msg: 'Fetching User Scopes !' }, { root: true })
      return AuthAPI.getUserScopes()
        .then(scopes => {
          commit('SET_USER_SCOPES', scopes)
          return scopes
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'user-scopes' }, { root: true })
        })
    },
    setUserRoles ({ commit, dispatch, state }) {
      let userId = state.userDetails.id
      dispatch('loader/addMessage', { type: 'user-roles', msg: 'Fetching User Roles !' }, { root: true })
      return AuthAPI.getUserRoles(userId)
        .then(roles => {
          commit('SET_USER_ROLES', roles)
          return roles
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'user-roles' }, { root: true })
        })
    },
    logout ({ commit, rootState }, { keepSession, triggerLogoutEndPoint }) {
      // keep session if asked to do so
      if (!keepSession) {
        commit('auth/RESET', {}, { root: true })
        if (triggerLogoutEndPoint) {
          AuthAPI.logout()
            .then(() => {
              commit('auth/RESET', {}, { root: true })
            })
        }
      }
      commit('flavors/RESET', {}, { root: true })
      commit('gateway/RESET', {}, { root: true })
      commit('images/RESET', {}, { root: true })
      commit('organisations/RESET', {}, { root: true })
      commit('loadBalancers/RESET', {}, { root: true })
      commit('loader/RESET', {}, { root: true })
      commit('networks/RESET', {}, { root: true })
      commit('projects/RESET', {}, { root: true })
      commit('providers/RESET', {}, { root: true })
      commit('securityGroupRules/RESET', {}, { root: true })
      commit('securityGroups/RESET', {}, { root: true })
      commit('ui/RESET', {}, { root: true })
      commit('userRoles/RESET', {}, { root: true })
      commit('userRoleScopes/RESET', {}, { root: true })
      commit('users/RESET', {}, { root: true })
      commit('virtualMachines/RESET', {}, { root: true })
      commit('volumes/RESET', {}, { root: true })
      commit('resourceStats/RESET', {}, { root: true })
      commit('scalingGroups/RESET', {}, { root: true })
      return Promise.resolve()
    },

    selectDomain ({ commit }, domain) {
      commit('SELECT_DOMAIN', domain)
    },

    checkAuthToken ({ commit, dispatch }, { token }) {
      dispatch('loader/addMessage', { type: 'check-auth-token', msg: 'Please wait. !' }, { root: true })
      return UsersAPI.checkToken(token)
        .then(user => {
          return user
        })
        .finally(() => {
          dispatch('loader/removeMessage', { type: 'check-auth-token' }, { root: true })
        })
    },

    setUserDetails ({ commit }) {
      return UsersAPI.user()
        .then(user => {
          commit('SET_USER', user)
          return user
        })
        .catch(error => console.log(error))
        .finally(() => {})
    }
  }
}
