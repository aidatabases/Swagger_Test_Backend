<template>
  <td>
    <div v-if="taskId || status.text === 'Processing'" class="progress-bar-wrapper">
      <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        {{ status.text }}
      </div>
    </div>
    <span v-else :class="['snap-status', status.class]">{{ status.text }}</span>
  </td>
</template>

<script>
export default {
  name: 'VirtualMachineListRowVmStatus',
  props: ['pTaskId', 'pStatus'],
  computed: {
    taskId () {
      return this.pTaskId
    },
    initialStatusText () {
      return this.pStatus.toUpperCase()
    },
    status () {
      var status = { 'class': 'c-green', 'text': 'Processing' }

      if (this.taskId || this.initialStatusText === 'PROCESSING') {
        return status
      }
      switch (this.initialStatusText) {
        case 'ACTIVE':
          status.class = 'c-green'
          status.text = 'Running'
          break
        case 'REBOOT':
          status.class = 'c-green'
          status.text = 'Restarting'
          break
        case 'PAUSED':
          status.class = 'c-gray'
          status.text = 'Paused'
          break
        case 'SHUTOFF':
          status.class = 'c-red'
          status.text = 'Stopped'
          break
        case 'ERROR':
          status.class = 'c-red'
          status.text = 'Error'
          break
        case 'SUCCESS':
          status.class = 'c-green'
          status.text = 'Running'
          break
        case 'VERIFY_RESIZE':
          status.class = 'c-warning'
          status.text = 'Verify Resize'
          break
        default:
          status.class = 'c-gray'
          status.text = this.initialStatusText
      }
      return status
    }
  }
}
</script>

<style scoped>
  .progress-bar{ text-transform: uppercase; }
</style>
