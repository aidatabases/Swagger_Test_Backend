import moment from 'moment'
// import _ from 'lodash'

const state = {
  message: []
}

const mutations = {
  ADD_MESSAGE (state, details) {
    let msg = {}
    msg['type'] = details['type']
    msg['msg'] = details['msg']
    msg['ts'] = moment().unix()
    state.message.push(msg)
    state.message.sort((a, b) => a.ts - b.ts)
  },

  REMOVE_MESSAGE (state, details) {
    let type = details['type']
    state.message = state.message.filter(function (el) {
      return (el.type !== type)
    })
  },
  RESET (state) {
    state.message = []
  }
}

const actions = {
  addMessage (context, details) {
    context.commit('ADD_MESSAGE', details)
  },

  removeMessage (context, details) {
    context.commit('REMOVE_MESSAGE', details)
  }
}

const getters = {
  isLoading (state) {
    return !(state.message.length === 0)
  },
  loadingMsg (state) {
    if (state.message.length !== 0) {
      return state.message[0]['msg']
    }
    return ''
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
