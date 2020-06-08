<template>
  <td>
      <!-- <div v-else class="btn-group pull-right" role="group">
        <button v-if="isActive" type="button" v-tooltip="'Shutoff'" class="btn btn-default" @click.prevent="stopVm"><i class="fa fa-power-off"></i></button>
        <button v-else-if="isShutOff" type="button" v-tooltip="'Start'" class="btn btn-default" @click.prevent="startVm"><i class="fa fa-play"></i></button>
        <button v-else type="button" v-tooltip="'Start'" disabled="disabled" class="btn btn-default"><i class="fa fa-play"></i></button>

        <button v-if="isActive" type="button" v-tooltip="'Pause'" class="btn btn-default" @click.prevent="pauseVm"><i class="fa fa-pause-circle fa-lg"></i></button>
        <button v-else-if="isPaused || isPaused" type="button" v-tooltip="'Unpause'" class="btn btn-default" @click.prevent="unpauseVm"><i class="fa fa-step-forward"></i></button>
        <button v-else type="button" v-tooltip="'Pause'" disabled="disabled" class="btn btn-default"><i class="fa fa-pause-circle fa-lg"></i></button>

        <button v-if="isActive" type="button" v-tooltip="'Reboot'" class="btn btn-default" @click.prevent="restartVm"><i class="fa fa-repeat"></i></button>
        <button v-else type="button" v-tooltip="'Reboot'" disabled="disabled" class="btn btn-default"><i class="fa fa-repeat"></i></button>

        <button v-if="isActive || isShutOff" type="button" v-tooltip="'Hard Reboot'" class="btn btn-default" @click.prevent="hardRestartVm"><i class="fa fa-refresh"></i></button>
        <button v-else type="button" v-tooltip="'Hard Reboot'" disabled="disabled" class="btn btn-default"><i class="fa fa-refresh"></i></button>

        <button v-if="isActive || isShutOff || isError" type="button" v-tooltip="'Delete'" class="btn btn-default" @click.prevent="deleteVm"><i class="fa fa-trash"></i></button>
        <button v-else type="button" v-tooltip="'Delete'" disabled="disabled" class="btn btn-default"><i class="fa fa-trash"></i></button> -->

        <!--<button type="button" v-tooltip="'Rebuild'" class="btn btn-default" disabled="disabled" @click.prevent="rebuildVM"><i class="fa fa-cogs"></i></button>-->
      <!--</div>-->
    <div class="dropdown">
      <button :disabled="isInProcess" class="btn btn-default btn-sm dropdown-toggle" type="button" id="action-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
        Actions <span class="caret"></span>
      </button>
      <ul class="dropdown-menu" aria-labelledby="action-dropdown">
        <li v-if="isResizeVerificationPending" type="button" class="btn btn-link btn-block btn-action" @click.prevent="confirmResizeVm"><i class="fa fa-check"></i> Confirm</li>
        <li v-if="isResizeVerificationPending" type="button" class="btn btn-link btn-block btn-action" @click.prevent="revertResizeVm"><i class="fa fa-undo"></i> Revert</li>

        <li v-if="isActive" type="button" class="btn btn-link btn-block btn-action" @click.prevent="stopVm"><i class="fa fa-power-off"></i> Shutoff</li>
        <li v-else-if="isShutOff" type="button" class="btn btn-link btn-block btn-action" @click.prevent="startVm"><i class="fa fa-play"></i> Start</li>

        <li v-if="isActive" type="button" class="btn btn-link btn-block btn-action" @click.prevent="pauseVm"><i class="fa fa-pause-circle fa-lg"></i> Pause</li>
        <li v-else-if="isPaused || isPaused" type="button" class="btn btn-link btn-block btn-action" @click.prevent="unpauseVm"><i class="fa fa-step-forward"></i> Unpause</li>

        <li v-if="isActive" type="button" class="btn btn-link btn-block btn-action" @click.prevent="restartVm"><i class="fa fa-repeat"></i> Reboot</li>

        <li v-if="isActive || isShutOff" type="button" class="btn btn-link btn-block btn-action" @click.prevent="hardRestartVm"><i class="fa fa-refresh"></i> Hard Reboot</li>

        <li v-if="isActive || isShutOff || isError" type="button" class="btn btn-link btn-block btn-action" @click.prevent="deleteVm"><i class="fa fa-trash"></i> Delete</li>

        <li role="separator" class="divider"></li>
        <li v-if="!isResizeVerificationPending" type="button" class="btn btn-link btn-block btn-action">
          <router-link :to="`/virtual-machines/${vmId}/console`">
            <i class="fa fa-terminal"></i> Console
          </router-link>
        </li>
        <li type="button" class="btn btn-link btn-block btn-action">
          <router-link :to="`/virtual-machines/${vmId}/consoleLog`">
            <i class="fa fa-file-text-o"></i> Logs
          </router-link>
        </li>
      </ul>
    </div>
  </td>
</template>

<script>
import store from 'vuex-store'
import { startVm, stopVm, pauseVm, unpauseVm, restartVm, hardRestartVm, rebuildVm, deleteVm, confirmResizeVm, revertResizeVm } from '@/utils/VirtualMachinesUtil'

export default {
  props: ['pVmId', 'pStatus', 'taskId'],
  computed: {
    status () {
      return this.pStatus.toUpperCase()
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
    },
    isResizeVerificationPending () {
      return this.status === 'VERIFY_RESIZE'
    },
    isInProcess () {
      return this.taskId || this.status === 'PROCESSING'
    }
  },
  methods: {
    stopVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Stop VM', msg: 'Are you sure to stop Virtual Machine ? ' })
        .then((cnf) => {
          stopVm(this.pVmId)
        })
    },
    startVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Start VM', msg: 'Are you sure to Start Virtual Machine ? ' })
        .then((cnf) => {
          startVm(this.pVmId)
        })
    },
    pauseVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Pause VM', msg: 'Are you sure to pause Virtual Machine ? ' })
        .then((cnf) => {
          pauseVm(this.pVmId)
        })
    },
    unpauseVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Unpause VM', msg: 'Are you sure to unpause Virtual Machine ? ' })
        .then((cnf) => {
          unpauseVm(this.pVmId)
        })
    },
    restartVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Reboot VM', msg: 'Are you sure to Reboot Virtual Machine ? ' })
        .then((cnf) => {
          restartVm(this.pVmId)
        })
    },
    hardRestartVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Hard Reboot VM', msg: 'Are you sure to Hard Reboot Virtual Machine ? ' })
        .then((cnf) => {
          hardRestartVm(this.pVmId)
        })
    },
    rebuildVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Rebuild VM', msg: 'Are you sure to Rebuild Virtual Machine ? ' })
        .then((cnf) => {
          rebuildVm(this.pVmId)
        })
    },
    deleteVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Delete VM', msg: 'Are you sure to delete Virtual Machine ? ' })
        .then((cnf) => {
          deleteVm(this.pVmId)
        })
    },
    confirmResizeVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Resize Virtual machine', msg: 'Are you sure to resize Virtual Machine ? ' })
        .then((cnf) => {
          confirmResizeVm(this.pVmId)
        })
    },
    revertResizeVm () {
      store.dispatch('confirmation/showConfirmation', { title: 'Revert Virtual Machine Resize', msg: 'Are you sure to revert resize Virtual Machine ? ' })
        .then((cnf) => {
          revertResizeVm(this.pVmId)
        })
    }
  }
}
</script>
