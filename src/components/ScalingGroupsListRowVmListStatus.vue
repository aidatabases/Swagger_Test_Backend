<template>
  <div>
    <div v-if="taskId || status.text === 'Processing'" class="progress-bar-wrapper">
      <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        {{ status.text }}
      </div>
    </div>
    <span v-else :class="['snap-status', status.class]">{{ status.text }}</span>
    <div style="text-align: left">
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ScalingGroupsListRowVmListStatus',
  props: ['pComputeId'],
  computed: {
    ...mapGetters('scalingGroups', ['computes']),
    compute () {
      return _.find(this.computes, ['id', parseInt(this.pComputeId)])
      // return this.computeById(this.pComputeId)
    },
    taskId () {
      return this.compute.task_id
    },
    action () {
      return this.compute.action
    },
    status () {
      var status = { 'class': 'c-green', 'text': 'Processing' }
      let statusText = (this.compute.hasOwnProperty('_meta')) ? this.compute._meta['status'] : this.action

      if (this.taskId || statusText === 'processing') {
        return status
      }

      switch (statusText) {
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
        case 'success':
          status.class = 'c-green'
          status.text = 'Running'
          break
        default:
          status.class = 'c-gray'
          status.text = statusText
      }
      return status
    }
  }
}
</script>
