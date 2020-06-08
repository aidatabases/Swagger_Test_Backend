<template>
  <td>
    <div v-if="taskId" class="progress-bar-wrapper pull-left">
      <div class="progress-bar progress-bar-gray progress-bar-striped active text-uppercase" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        {{ status }}
      </div>
    </div>
    <span v-else :class="['snap-status', statusClass]">{{ status }}</span>
  </td>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ScalingGroupsListStatus',
  props: ['pScalingGroupId'],
  // data () {
  //   return {
  //     scalingGroup: {
  //       id: null,
  //       task_id: null,
  //       action: ''
  //     }
  //   }
  // },
  computed: {
    ...mapGetters('scalingGroups', ['scalingGroups']),
    scalingGroupId () {
      return this.pScalingGroupId
    },
    scalingGroup () {
      return _.find(this.scalingGroups, ['id', parseInt(this.pScalingGroupId)])
    },
    taskId () {
      return this.scalingGroup['task_id']
    },
    action () {
      return this.scalingGroup['action']
    },
    status () {
      return (this.scalingGroup.hasOwnProperty('_meta')) ? this.scalingGroup._meta['status'] : this.action
    },
    statusClass () {
      return this.hasError ? 'c-red' : 'c-purple'
    },
    hasError () {
      return this.status.includes('error')
    }
  },
  // created () {
  //   Object.assign(this.scalingGroup, this.pScalingGroup)
  // },
  watch: {
    'scalingGroups': function (cv, pv) {}
  }
}
</script>
