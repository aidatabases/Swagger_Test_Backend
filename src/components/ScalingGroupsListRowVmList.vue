<template>
  <tr>
    <td class="acc-content-row" colspan="5">
      <div v-if="showList" class="acc-content">
        <div class="clearfix">
          <template v-if="computes.length > 0">
            <div v-for="compute in computes" :key="compute.id" class="acc-cont-box">
              <div class="acc-cont-head clearfix">
                <h5 @click="viewDetails(compute)" class="vm-item">{{ compute.instance_name }}</h5>
                <scaling-group-compute-status :p-compute-id="compute.id"></scaling-group-compute-status>
              </div>
              <div class="acc-cont-meta clearfix">
                <p class="pull-left">{{ compute.private_ip }}</p>
                <scaling-group-compute-action :p-scaling-group-id="scalingGroupId" :p-vm-id="compute.id" :p-status="compute.action"></scaling-group-compute-action>
              </div>
            </div>
          </template>
          <div v-else-if="computes.length < 1">
              <h3 class="text-center" style="color: #90A4AE;">No computes available</h3>
          </div>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { mapGetters } from 'vuex'
import { listScalingGroupsComputes } from '@/utils/ScalingGroupsUtil'
import scalingGroupComputeAction from '@/components/ScalingGroupsListRowVmListActions'
import scalingGroupComputeStatus from '@/components/ScalingGroupsListRowVmListStatus'
import _ from 'lodash'

export default {
  props: {
    scalingGroup: Object,
    scalingGroupId: Number,
    toggleComputeList: Boolean,
    selectedRowGroupId: Number
  },
  data () {
    return {
      showList: false
    }
  },
  components: { scalingGroupComputeAction, scalingGroupComputeStatus },
  computed: {
    ...mapGetters('scalingGroups', ['computesByScalingGroupId']),
    computes () {
      let defaultComputeData = {
        action: '',
        instance_name: '',
        private_ip: ''
      }
      let computeList = this.computesByScalingGroupId(this.scalingGroupId)
      let sortedComputeList = _.orderBy(computeList, ['id'])
      return (computeList !== undefined && computeList !== null) ? sortedComputeList : defaultComputeData
    },
    isProcessing () {
      return this.scalingGroup['task_id'] !== ''
    },
    isVmHasError () {
      return (this.scalingGroup.action.toLowerCase()).includes('error')
    }
  },
  methods: {
    viewDetails (compute) {
      if (!this.hasVmError(compute)) {
        this.$router.push({ path: `/scaling-groups/virtual-machines/${compute['id']}` })
      } else {
        // TODO: Replace with toast message
        alert('Task is in progress.')
      }
    },
    hasVmError (compute) {
      return compute['task_id'] || (compute.action.toLowerCase()).includes('error')
    }
  },
  watch: {
    toggleComputeList () {
      if (this.selectedRowGroupId === this.scalingGroupId) {
        if (!this.isProcessing && !this.isVmHasError) {
          this.showList = !this.showList
          if (this.showList) {
            listScalingGroupsComputes(this.scalingGroupId)
          }
        } else {
          this.showList = false
        }
      }
    }
    // scalingGroup () {
    //   if (this.isProcessing || this.isVmHasError) {
    //     this.showList = false
    //   }
    // }
  }
}
</script>

<style scoped>
  .vm-item { cursor: pointer; }
  .vm-item:hover { color: #4b12ff; }
</style>
