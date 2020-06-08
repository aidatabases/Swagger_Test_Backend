import PublicIPApi from '@/api/PublicIP'

export default {
  namespaced: true,
  strict: true,

  state: {
    floatingIPs: []
  },

  mutations: {
    SET_FLOATING_IPS (state, payload) {
      state.floatingIPs = payload    
    }
  },

  actions: {
    LIST_IPS_BY_PROVIDER (context, { providerId }) {
      context.dispatch('loader/addMessage', { type: 'alloted-public-ips-by-provider-and-project', msg: `Fetching Public IPs alloted to provider's project!` }, { root: true })
      return PublicIPApi.listImportedIPsByProvider(providerId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'alloted-public-ips-by-provider-and-project' }, { root: true })
        })
    },

    LIST_ROUTABLE_IPS (context, { organisationId, providerId, projectId }) {
      context.dispatch('loader/addMessage', { type: 'routable-ips-by-organisation-provider-and-project', msg: `Fetching Routable Ips!` }, { root: true })
      return PublicIPApi.listRoutableIP(organisationId, providerId, projectId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'routable-ips-by-organisation-provider-and-project' }, { root: true })
        })
    },

    LIST_ALLOTED_IPS_BY_PROVIDER_PROJECT (context, { providerId, projectId }) {
      context.dispatch('loader/addMessage', { type: 'alloted-public-ips-by-provider-and-project', msg: `Fetching Public IPs alloted to provider's project!` }, { root: true })
      return PublicIPApi.listAllotedIPsByProviderAndProject(providerId, projectId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'alloted-public-ips-by-provider-and-project' }, { root: true })
        })
    },
    LIST_ALLOTED_IPS_BY_PROVIDER (context, { providerId }) {
      context.dispatch('loader/addMessage', { type: 'alloted-public-ips-by-provider', msg: 'Fetching Public IPs alloted to provider!' }, { root: true })
      return PublicIPApi.listAllotedIPsByProvider(providerId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'alloted-public-ips-by-provider' }, { root: true })
        })
    },
    LIST_ALLOTED_IPS_BY_PROJECT (context, { projectId }) {
      context.dispatch('loader/addMessage', { type: 'alloted-public-ips-by-project', msg: 'Fetching Public IPs alloted to project!' }, { root: true })
      return PublicIPApi.listAllotedIPsByProject(projectId)
        .then(result => {
          return result
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'alloted-public-ips-by-project' }, { root: true })
        })
    },
    REQUEST_PUBLIC_IP (context, { applicationName, applicationUrl, aadharCompliance, routableIp, routableIpAttachedWith }) {
      let providerId = context.rootGetters['auth/selectedProvider']
      let projectId = context.rootGetters['auth/selectedProject']
      let payload = {}
      payload['application_name'] = applicationName
      payload['application_url'] = applicationUrl
      payload['aadhar_compliance'] = aadharCompliance
      payload['routable_ip'] = routableIp
      payload['routable_ip_attached_with'] = routableIpAttachedWith
      context.dispatch('loader/addMessage', { type: 'public-ip-request', msg: 'Requesting Public IP' }, { root: true })
      return PublicIPApi.requestPublicIP(providerId, projectId, payload)
        .then(response => {
          return response
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'public-ip-request' }, { root: true })
        })
    }
  },

  getters: {
    floatingIPs (state) {
      return state.floatingIPs
    }
  }
}
