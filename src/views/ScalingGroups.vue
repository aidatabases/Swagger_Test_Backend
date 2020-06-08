<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container fip vm scale">
        <div class="snap-table-head clearfix">
          <h1>Scaling Groups</h1>
          <router-link class="btn btn-cloud" to="/scaling-groups/create">Create New</router-link>
        </div>
        <scaling-groups-list></scaling-groups-list>
      </div>
    </div>
  </div>
</template>

<script>
import ScalingGroupsList from '@/components/ScalingGroupsList'

export default {
  data () {
    return {
      showScalingGroupResizeModal: -1,
      selectedScalingGroupId: null,
      selectedClusterSize: null
    }
  },
  components: {
    scalingGroupsList: ScalingGroupsList
  }
}
</script>
