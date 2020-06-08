<template>
  <tr>
    <td>
      <volume-name :volume="pVolume"></volume-name>
    </td>
    <volume-attached-device :p-status-error="hasStatusError" :p-is-attached="isAttached" :p-attached-vm="attachedVm" :p-volume="pVolume" @vm-changed="selectVMForAssociation"></volume-attached-device>
    <volume-status :p-volume="pVolume" :p-is-attached="isAttached" :p-task-id="taskId" :p-action-status="action"></volume-status>
    <volume-actions :p-volume-id="volumeId" :p-status-error="hasStatusError" :p-is-attached="isAttached" :p-task-id="taskId" :p-attached-vm-id="attachedVm.compute_id" :p-selected-vm-for-association="selectedVmForAssociation"></volume-actions>
  </tr>
</template>

<script>
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import VolumeStatus from './VolumeListRowStatus'
import VolumeActions from './VolumeListRowActions'
import VolumeName from './VolumeListRowName'
import VolumeAttachedDevice from './VolumeListRowAttachedDevice'
import { mapGetters } from 'vuex'

export default {
  mixins: [projectProviderMixin],
  name: 'VolumeRow',
  props: {
    'pVolume': Object,
    'pShowShort': {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectedVmForAssociation: null,
      actionResponse: '',
      hasStatusError: false
    }
  },
  components: {
    volumeStatus: VolumeStatus,
    volumeActions: VolumeActions,
    volumeName: VolumeName,
    volumeAttachedDevice: VolumeAttachedDevice
  },
  computed: {
    ...mapGetters('auth', ['selectedProvider', 'selectedProject']),
    isAttached () {
      return this.pVolume.volume_attach_volume.length > 0
    },
    taskId () {
      return this.pVolume.task_id
    },
    volumeId () {
      return this.pVolume.id
    },
    requiredToFetchVolumeStatus () {
      return !!this.taskId
    },
    action () {
      return this.pVolume.action
    },
    attachedVm () {
      if (!this.isAttached) {
        return {}
      }
      return this.pVolume.volume_attach_volume[0]
    }
  },
  methods: {
    selectVMForAssociation (selectedVmForAssociation) {
      this.selectedVmForAssociation = selectedVmForAssociation
    },
    handleVolumeError () {
      this.hasStatusError = true
    }
  }
}
</script>
