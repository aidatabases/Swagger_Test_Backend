<template>
  <div class="btn-group pull-right" role="group">
    <button v-if="isActive" type="button" v-tooltip="'Shutoff'" class="btn btn-default" @click.prevent="stopCompute"><i class="fa fa-power-off"></i></button>
    <button v-else-if="isShutOff" type="button" v-tooltip="'Start'" class="btn btn-default" @click.prevent="startCompute"><i class="fa fa-play"></i></button>
    <button v-else type="button" v-tooltip="'Start'" disabled="disabled" class="btn btn-default"><i class="fa fa-play"></i></button>

    <button v-if="isActive" type="button" v-tooltip="'Reboot'" class="btn btn-default" @click.prevent="restartCompute"><i class="fa fa-repeat"></i></button>
    <button v-else type="button" v-tooltip="'Reboot'" disabled="disabled" class="btn btn-default"><i class="fa fa-repeat"></i></button>
  </div>
</template>

<script>
import store from 'vuex-store'
import { startCompute, stopCompute, restartCompute } from '@/utils/ScalingGroupsUtil'

export default {
  name: 'ScalingGroupsListRowVmListActions',
  props: ['pScalingGroupId', 'pVmId', 'pStatus'],
  computed: {
    status () {
      return this.pStatus
    },
    vmId () {
      return this.pVmId
    },
    isActive () {
      return this.status === 'ACTIVE'
    },
    isShutOff () {
      return this.status === 'SHUTOFF'
    },
    isPaused () {
      return this.status === 'PAUSED'
    },
    isError () {
      return this.status === 'ERROR'
    }
  },
  methods: {
    stopCompute () {
      store.dispatch('confirmation/showConfirmation', { title: 'Stop VM', msg: 'Are you sure to stop Virtual Machine ? ' })
        .then((cnf) => {
          stopCompute(this.pScalingGroupId, this.pVmId)
        })
    },
    startCompute () {
      store.dispatch('confirmation/showConfirmation', { title: 'Start VM', msg: 'Are you sure to Start Virtual Machine ? ' })
        .then((cnf) => {
          startCompute(this.pScalingGroupId, this.pVmId)
        })
    },
    restartCompute () {
      store.dispatch('confirmation/showConfirmation', { title: 'Reboot VM', msg: 'Are you sure to Reboot Virtual Machine ? ' })
        .then((cnf) => {
          restartCompute(this.pScalingGroupId, this.pVmId)
        })
    }
  }
}
</script>
