export default {
  namespaced: true,
  strict: true,

  state: {
    msg: null,
    title: null,
    hidden: true,
    _id: -9,
    resolveCB: null,
    rejectCB: null
  },
  mutations: {
    SET_MSG (state, { msg, title }) {
      state.msg = msg
      state.title = title
      state._id = Math.floor(Math.random() * Math.floor(100))
      state.hidden = false
    },
    SET_RESOLVE (state, cb) {
      state.resolveCB = cb
    },
    SET_REJECT (state, cb) {
      state.rejectCB = cb
    },
    RESET (state) {
      state.msg = null
      state.resolveCB = null
      state.rejectCB = null
      state.title = null
      state.hidden = true
    }
  },
  actions: {
    showConfirmation ({ commit }, { msg, title }) {
      let p = new Promise((resolve, reject) => {
        commit('SET_RESOLVE', () => {
          resolve('accepted')
        })
        commit('SET_REJECT', () => {
          reject(new Error('declined'))
        })
      })
      commit('SET_MSG', { msg, title })
      return p
    },
    hideConfirmation ({ commit }) {
      commit('RESET')
    },
    decline ({ state, commit }) {
      state.rejectCB()
      commit('RESET')
    },
    confirm ({ state, commit }) {
      state.resolveCB()
      commit('RESET')
    }
  },
  getters: {
    msg (state, getters, rootState, rootGetters) {
      return state.msg
    },
    title (state, getters, rootState, rootGetters) {
      return state.title
    },
    contentId (state, getters) {
      return state._id
    },
    hidden (state) {
      return state.hidden
    }
  }
}
