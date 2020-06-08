<template>
  <td>
    <div class="btn-group" role="group" aria-label="...">
      <button type="button" :disabled="isResizeButtonDisabled ? 'disabled' : false" class="btn btn-default" v-tooltip="'Resize Scaling Group'" @click.prevent="showResizeScalingGroupModal()"><i class="fa fa-arrows-alt"></i></button>
      <button type="button" :disabled="isProcessing ? 'disabled' : false" class="btn btn-default" v-tooltip="'Delete Scaling Group'" @click.prevent="deleteGroup()"><i class="fa fa-trash"></i></button>
    </div>
  </td>
</template>

<script>
import store from 'vuex-store'
import { deleteScalingGroup } from '@/utils/ScalingGroupsUtil'

export default {
  props: ['pScalingGroup'],
  computed: {
    scalingGroupId () {
      return this.pScalingGroup['id']
    },
    clusterSize () {
      return this.pScalingGroup['cluster_size']
    },
    flavorId () {
      return this.pScalingGroup['flavor_id']
    },
    isProcessing () {
      return this.pScalingGroup['task_id'] !== ''
    },
    isResizeButtonDisabled () {
      return this.pScalingGroup['task_id'] !== '' || (this.pScalingGroup.action.toLowerCase()).includes('error')
    }
  },
  methods: {
    deleteGroup () {
      store.dispatch('confirmation/showConfirmation', { title: 'Delete', msg: 'Are you sure to delete Scaling Group?' })
        .then((cnf) => {
          deleteScalingGroup(this.scalingGroupId)
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    showResizeScalingGroupModal (scalingGroupId) {
      // Emit scaling group modal
      this.$emit('show-resize-modal', scalingGroupId)
    }
  }
}
</script>
