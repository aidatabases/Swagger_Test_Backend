<template>
    <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
      <div class="console-header">
        <p><i class="fa fa-terminal"></i> Console Logs</p>
      </div>
      <div class="console-body">
        <pre v-if="logs !== ''">
          <code>{{ logs }}</code>
        </pre>
        <span v-if="logs === ''" class="center-wrapper">
          <span class="fa-stack cloud-loader">
            <i class="fa fa-cloud fa-stack-2x" style="color: #ffffff"></i>
            <i class="fa fa-refresh fa-spin fa-stack-1x"></i>
          </span>
        </span>
      </div>
    </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
export default {
  name: 'VirtualMachineDetailConsoleLog',
  props: ['computeId'],
  data () {
    return {
      logs: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['selectedProvider', 'selectedProject']),
    ...mapGetters('providers', ['getSelectedProviderId']),
    ...mapGetters('projects', ['getSelectedProjectId'])
  },
  methods: {
    viewLogs () {
      store.dispatch('virtualMachines/CONSOLE_LOGS', { 'providerId': this.selectedProvider, 'projectId': this.selectedProject, 'computeId': this.computeId, 'lines': 100 })
        .then(response => {
          this.logs = response.console_log
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 8000,
            text: 'An error occurred while fetching data!'
          })
        })
        .finally(() => {})
    }
  },
  created () {
    this.viewLogs()
  }
}
</script>

<style scoped>
  .console-header {
    background-color: #ffffff;
    color: #000;
    border-radius: 4px 4px 0 0;
    padding: 4px 10px;
  }
  .console-header>p{ font-weight: bold; }
  .console-body { height: 500px; overflow-y: scroll; background-color: #000000; border-radius: 0 0 4px 4px;}
  pre {
    background-color: #000000 !important;
    border: none !important;
    border-radius: 0 0 4px 4px !important;
  }
  code {
    font-size: 90%;
    color: #ffffff !important;
    background-color: #000000 !important;
  }
  .cloud-loader {
    font-size: 40px;
  }
  .center-wrapper {
    height: inherit;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
