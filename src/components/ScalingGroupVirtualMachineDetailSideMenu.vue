<template>
  <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
    <nav class="sidenav">
      <ul>
        <li class="hidden" @click="selectedTab('Overview')"><a href="#">Overview</a></li>
        <li><button @click="selectedTab('Volumes')">Storage</button></li>
        <li class="hidden"><button @click="selectedTab('Resize')">Resize</button></li>
        <li class="hidden" @click="selectedTab('Snapshots')"><button>Snapshots</button></li>
        <li class="hidden"><button @click="selectedTab('Networks')">Networks</button></li>
        <li><button @click="selectedTab('Console')">Console</button></li>
        <li><button @click="selectedTab('ConsoleLog')">Console Log</button></li>
        <li class="hidden" @click="selectedTab('Logs')"><button>Log</button><a href="#">Log</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'ScalingGroupVirtualMachineDetailSideMenu',
  data () {
    return {
      currentTab: ''
    }
  },
  methods: {
    selectedTab (tabName) {
      this.$emit('tab-selected', tabName)
    }
  }
}
</script>
