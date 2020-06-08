<template>
  <bootstrap-modal ref="vmLogModal" :need-header="true" :need-footer="true" :size="'large'">
    <div slot="title">
      <h4 class="modal-title">Virtual Machine Logs</h4>
    </div>
    <div slot="body">
      <pre class="codes"><code>{{ logs }}</code></pre>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'

export default {
  name: 'VirtualMachineLogModal',
  components: {
    bootstrapModal: bootstrapModal
  },
  data () {
    return {
      computeId: -1,
      logs: ''
    }
  },
  computed: {
    ...mapGetters('providers', ['getSelectedProviderId']),
    ...mapGetters('projects', ['getSelectedProjectId']),
    ...mapGetters('ui', ['showVmLogModal'])
  },
  methods: {
    showModal () {
      this.$refs.vmLogModal.open()
    },
    hideModal () {
      this.$refs.vmLogModal.close()
    },
    viewLogs () {
      store.dispatch('virtualMachines/CONSOLE_LOGS', { 'providerId': this.getSelectedProviderId, 'projectId': this.getSelectedProjectId, 'computeId': this.computeId, 'lines': 100 })
        .then(response => {
          this.logs = response.console_log
          this.showModal()
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 8000,
            text: 'An error occurred while creating volume!'
          })
        })
        .finally(() => {})
    }
  },
  watch: {
    'showVmLogModal.cb': function (cv, pv) {
      this.computeId = this.showVmLogModal['computeId']
      this.viewLogs()
    }
  }
}
</script>

<style scoped>
  .codes { background-color: #000000 !important; color: #ffffff !important; }
</style>
