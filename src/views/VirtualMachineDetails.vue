<template>
  <div>
    <div class="page-head">
      <vm-info :vm="compute"></vm-info>
    </div>
    <div class="page-content">
      <div class="row">
        <vm-side-menu :selected-tab="currentTab"></vm-side-menu>
        <router-view :compute-id="computeId"/>
        <!--<vm-side-menu :selected-tab="currentTab" :compute-id="computeId"></vm-side-menu>
        <component :is="selectedComponent" :vm="compute"></component>-->
      </div>
    </div>
  </div>
</template>

<script>
import VMSideMenu from '@/components/VirtualMachineDetailSideMenu'
import VMInfo from '@/components/VirtualMachineDetailInfo'
import { getOne } from '@/utils/VirtualMachinesUtil'

export default {
  name: 'VirtualMachineDetails',
  data () {
    return {
      compute: []
    }
  },
  props: ['computeId'],
  components: {
    vmSideMenu: VMSideMenu,
    vmInfo: VMInfo
  },
  computed: {
    currentTab () {
      return (this.$route.params.section) ? this.$route.params.section : 'Volumes'
    },
    selectedComponent () {
      return 'vm-' + this.currentTab
    }
  },
  methods: {
    computeDetails () {
      let _this = this
      if (this.computeId) {
        getOne(this.computeId)
          .then(vm => {
            _this.compute = vm
          })
      }
    }
  },
  mounted () {
    this.computeDetails()
  }
}
</script>
