export default {
  namespaced: true,

  state: {
    showProjectProviderMapModal: { cb: -1, projectId: null },
    showProjectUserMapModal: { cb: -1, projectId: null },
    showVmLogModal: { cb: -1, computeId: null }
  },

  mutations: {
    SHOW_PROJECT_PROVIDER_MAP_MODAL (state, projectId) {
      state.showProjectProviderMapModal.cb = Math.floor(Math.random() * 100)
      state.showProjectProviderMapModal.projectId = projectId
    },
    SHOW_PROJECT_USER_MAP_MODAL (state, projectId) {
      state.showProjectUserMapModal.cb = Math.floor(Math.random() * 100)
      state.showProjectUserMapModal.projectId = projectId
    },
    SHOW_VM_LOG_MODAL (state, computeId) {
      state.showVmLogModal.cb = Math.floor(Math.random() * 100)
      state.showVmLogModal.computeId = computeId
    },
    RESET (state) {
      state.showProjectProviderMapModal = { cb: -1, projectId: null }
      state.showProjectUserMapModal = { cb: -1, projectId: null }
      state.showVmLogModal = { cb: -1, computeId: null }
    }
  },

  getters: {
    showProjectProviderMapModal (state) {
      return state.showProjectProviderMapModal
    },
    showProjectUserMapModal (state) {
      return state.showProjectUserMapModal
    },
    showVmResizeModal (state) {
      return state.showVmResizeModal
    },
    showVmLogModal (state) {
      return state.showVmLogModal
    }
  }
}
