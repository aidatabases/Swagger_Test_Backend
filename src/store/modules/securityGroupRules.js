import SecurityGroupsApi from '@/api/SecurityGroups'
import store from 'vuex-store'
import _ from 'underscore'
import Vue from 'vue'

export default {
  namespaced: true,

  state: {
    securityGroupRules: {}
  },

  mutations: {
    SET_SECURITY_GROUP_RULES (state, { securityGroupRules, securityGroupId }) {
      if (!_.isEmpty(securityGroupRules)) {
        Vue.set(state.securityGroupRules, '' + securityGroupId, securityGroupRules)
      }
    },
    RESET (state) {
      state.securityGroupRules = {}
    }
  },

  actions: {
    list (context, { providerId, projectId, securityGroupId }) {
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'list-security-group-rules', msg: 'Fetching your security group Rules !' }, { root: true })
      return SecurityGroupsApi.listSecurityGroupRules(providerId, projectId, securityGroupId)
        .then(securityGroupRules => {
          context.commit('SET_SECURITY_GROUP_RULES', { securityGroupRules, securityGroupId })
          return securityGroupRules
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'list-security-group-rules' }, { root: true })
        })
    },

    remove (context, { providerId, projectId, securityGroupId, securityGroupRuleId }) {
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      context.dispatch('loader/addMessage', { type: 'remove-security-group-rule', msg: 'Removing security Rule !' }, { root: true })
      return SecurityGroupsApi.removeSecurityGroupRule(providerId, projectId, securityGroupId, securityGroupRuleId)
        .then(() => {
        })
        .catch(error => console.log(error))
        .finally(() => {
          store.cache.delete('securityGroupRules/list', { 'securityGroupId': securityGroupId })
          store.cache.dispatch('securityGroupRules/list', { 'securityGroupId': securityGroupId })
          context.dispatch('loader/removeMessage', { type: 'remove-security-group-rule' }, { root: true })
        })
    },

    create (context, { providerId, projectId, securityGroupId, payload }) {
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      context.dispatch('loader/addMessage', { type: 'create-security-group-rule', msg: 'Creating security Rule !' }, { root: true })
      return SecurityGroupsApi.createSecurityGroupRule(providerId, projectId, securityGroupId, payload)
        .then(response => {
        })
        .finally(() => {
          store.cache.delete('securityGroupRules/list', { 'securityGroupId': securityGroupId })
          store.cache.dispatch('securityGroupRules/list', { 'securityGroupId': securityGroupId })
          context.dispatch('loader/removeMessage', { type: 'create-security-group-rule' }, { root: true })
        })
    }
  },
  getters: {
    securityGroupRulesById (state) {
      return (securityGroupId) => {
        if (_.has(state.securityGroupRules, securityGroupId)) {
          return state.securityGroupRules['' + securityGroupId]
        } else {
          // trigger update and cache the result
          store.cache.dispatch('securityGroupRules/list', { 'securityGroupId': securityGroupId })
          return []
        }
      }
    },
    securityGroupRules (state) {
      return state.securityGroupRules
    }
  }
}
