import FlavorsApi from '@/api/Flavors'
import _ from 'lodash'

export default {
  namespaced: true,

  state: {
    flavors: []
  },

  mutations: {
    SET_FLAVORS (state, payload) {
      state.flavors = payload
    },
    RESET (state) {
      state.flavors = []
    }
  },

  actions: {
    list (context) {
      let providerId = context.rootGetters['auth/selectedProvider']
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'flavors', msg: 'Loading Flavors !' }, { root: true })
      return FlavorsApi.listFlavors(providerId)
        .then(flavors => {
          flavors = _.orderBy(flavors, 'weight', 'asc')
          context.commit('SET_FLAVORS', flavors)
          return flavors
        })
        .catch(error => console.log(error))
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'flavors' }, { root: true })
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
