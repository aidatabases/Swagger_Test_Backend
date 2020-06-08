import ImagesApi from '@/api/Images'
import _ from 'lodash'
import store from 'vuex-store'

export default {
  namespaced: true,

  state: {
    images: []
  },

  mutations: {
    SET_IMAGES (state, payload) {
      state.images = payload
    },
    RESET (state) {
      state.images = []
    }
  },

  actions: {
    list (context, { providerId }) {
      if (!providerId) {
        providerId = context.rootGetters['auth/selectedProvider']
      }
      // return your ajax request as promise
      context.dispatch('loader/addMessage', { type: 'images', msg: 'Loading Images !' }, { root: true })
      return ImagesApi.listImages(providerId)
        .then(images => {
          context.commit('SET_IMAGES', images)
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          store.cache.delete('images/list', {})
          context.dispatch('loader/removeMessage', { type: 'images' }, { root: true })
        })
    }
  },

  getters: {
    images (state) {
      return state.images
    },
    imageById (state) {
      return (imageId) => {
        // return state.virtualMachines.filter(vm => vm.id === parseInt(computeId))
        return _.find(state.images, ['id', parseInt(imageId)])
      }
    }
  }
}
