<template>
  <div>
    <div class="page-head">
      <vm-info :vm="computeDetails"></vm-info>
    </div>
    <div class="page-content">
      <div class="row">
        <vm-side-menu @tab-selected="selectedTab($event)"></vm-side-menu>
        <component v-bind:is="selectedComponent" :vm="computeDetails"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VMSideMenu from '@/components/ScalingGroupVirtualMachineDetailSideMenu'
import VMInfo from '@/components/VirtualMachineDetailInfo'
import VMConsoleLog from '@/components/VirtualMachineDetailConsoleLog'
import VMConsole from '@/components/VirtualMachineDetailConsole'
import VMVolumes from '@/components/VirtualMachineDetailVolumes'
import _ from 'lodash'

export default {
  name: 'VirtualMachineDetails',
  data () {
    return {
      selectedComponent: 'vmVolumes',
      vmDetails: null
    }
  },
  components: {
    vmSideMenu: VMSideMenu,
    vmConsoleLog: VMConsoleLog,
    vmConsole: VMConsole,
    vmVolumes: VMVolumes,
    vmInfo: VMInfo
  },
  computed: {
    ...mapGetters('scalingGroups', ['computes']),
    computeId () {
      return this.$route.params.computeId
    },
    computeDetails () {
      let computeId = parseInt(this.computeId)
      return _.find(this.computes, { id: computeId })
    }
  },
  methods: {
    selectedTab (event) {
      this.selectedComponent = 'vm' + event
    }
  }
}
</script>
