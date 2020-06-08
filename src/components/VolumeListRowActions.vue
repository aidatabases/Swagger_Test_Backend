<template>
  <td>
    <div class="btn-group">
      <div class="btn-group" role="group">
        <button v-if="pIsAttached && !isPerformingAction" v-tooltip.top="'Detach Disk'" type="button" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Detach Disk" @click.prevent="detachVolume"><i class="fa fa-sign-out fa-lg"></i></button>
        <button v-else-if="pIsAttached && isPerformingAction" v-tooltip.top="'Action not allowed'" disabled="disabled" type="button" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Detach Disk" @click.prevent="detachVolume"><i class="fa fa-sign-out fa-lg"></i></button>

        <button v-else-if="!pIsAttached && !isPerformingAction" v-tooltip.top="'Attach Disk'" type="button" class="btn btn-success" @click.prevent="attachVolume()"><i class="fa fa-sign-in fa-lg"></i></button>
        <button v-else-if="!pIsAttached && isPerformingAction" v-tooltip.top="'Action not allowed'" disabled="disabled" type="button" class="btn btn-success"><i class="fa fa-sign-in fa-lg"></i></button>

        <button v-if="!pIsAttached && !isPerformingAction" v-tooltip.top="'Delete Disk'" type="button" class="btn btn-danger" @click.prevent="deleteVolume()"><i class="fa fa-trash fa-lg"></i></button>
        <button v-else v-tooltip.top="'Action not allowed'" type="button" class="btn btn-danger" disabled="disabled"><i class="fa fa-trash fa-lg"></i></button>
      </div>
    </div>
  </td>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'
import _ from 'lodash'
import { deleteVolume, attachVolume, detachVolume } from '@/utils/VolumesUtil'

export default {
  name: 'VolumeActions',
  props: {
    'pIsAttached': Boolean,
    'pTaskId': String,
    'pStatusError': Boolean,
    'pVolumeId': Number,
    'pSelectedVmForAssociation': Number,
    'pAttachedVmId': Number
  },
  data () {
    return {
      'isPerformingAction': (this.pTaskId !== '' && this.pTaskId !== null)
    }
  },
  computed: {
    ...mapGetters('auth', ['userId']),
    ...mapGetters('providers', ['getSelectedProviderId']),
    ...mapGetters('projects', ['getSelectedProjectId']),
    volumeId () {
      return this.pVolumeId
    }
  },
  methods: {
    attachVolume () {
      if (_.isNull(this.pSelectedVmForAssociation)) {
        return this.$notify({
          group: 'error',
          title: 'Error',
          type: 'error',
          duration: 20000,
          text: 'Please select a VM to attach with.'
        })
      }

      store.dispatch('confirmation/showConfirmation', { title: 'Attaching Disk', msg: 'Are you sure to attach disk? ' })
        .then((cnf) => {
          attachVolume(this.pSelectedVmForAssociation, this.volumeId)
        })
    },
    detachVolume () {
      store.dispatch('confirmation/showConfirmation', { title: 'Detaching Disk', msg: 'Are you sure to detach disk? ' })
        .then((cnf) => {
          detachVolume(this.pAttachedVmId, this.volumeId)
        })
    },
    deleteVolume () {
      store.dispatch('confirmation/showConfirmation', { title: 'Delete Disk', msg: 'This will delete the volume, all your data will be lost. Do you still want to delete the disk? ' })
        .then((cnf) => {
          deleteVolume(this.volumeId)
        })
    }
  },
  watch: {
    pTaskId: function (cv, ov) {
      // watching attached array rather should watch last updated
      this.isPerformingAction = (this.pTaskId !== '' && this.pTaskId !== null)
    }
  }
}
</script>
