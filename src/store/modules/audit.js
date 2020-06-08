import AuditApi from '@/api/AuditTrails'
import _ from 'lodash'

export default {
  namespaced: true,

  state: {
    logs: []
  },

  mutations: {
    SET_LOGS (state, payload) {
      state.logs = payload
    }
  },

  actions: {
    list (context, { userId, limit, recordId }) {
      // return your ajax request as promise
      return AuditApi.listAllAuditTrails(userId, limit, recordId)
        .then(res => {
          context.commit('SET_LOGS', res)
          return res
        })
        .catch(error => console.log(error))
        .finally(() => {
        })
    }
  },

  getters: {
    flavors (state) {
      return state.flavors
    },
    flavorById (state) {
      return (flavorId) => {
        // return state.virtualMachines.filter(vm => vm.id === parseInt(computeId))
        return _.find(state.flavors, ['id', parseInt(flavorId)])
      }
    }
  }
}
