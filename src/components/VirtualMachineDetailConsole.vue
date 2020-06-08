<template>
  <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
    <div class="console-header">
      <p><i class="fa fa-terminal"></i> Server Console <span v-if="!!consoleUrl">(<a :href="consoleUrl" target="_blank">Open in new Window</a>)</span></p>
    </div>
    <div class="console-body embed-responsive embed-responsive-16by9">
      <div v-if="consoleUrl !== ''" class="embed-responsive embed-responsive-16by9">
        <iframe class="embed-responsive-item" :src="consoleUrl"></iframe>
      </div>
      <span v-if="consoleUrl === ''" class="center-wrapper embed-responsive-item">
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
  name: 'VirtualMachineDetailConsole',
  props: ['computeId'],
  data () {
    return {
      consoleUrl: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['selectedProvider', 'selectedProject'])
  },
  methods: {
    viewLogs () {
      store.dispatch('virtualMachines/CONSOLE_URL', { 'providerId': this.selectedProvider, 'projectId': this.selectedProject, 'computeId': this.computeId })
        .then(response => {
          this.consoleUrl = response.console_url
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
  .console-body { background-color: #000000; border-radius: 0 0 4px 4px;}
  .cloud-loader {
    font-size: 40px;
  }
  .center-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
