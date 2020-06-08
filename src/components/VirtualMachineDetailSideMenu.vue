<template>
  <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
    <nav class="sidenav">
      <ul>
        <li class="hidden" @click="selectedTab('Overview')"><a href="#">Overview</a></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-volumes' }"><router-link :to="{ name: 'virtual-machine-details-volumes'}" tag="button">Storage</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-resize' }"><router-link :to="{ name: 'virtual-machine-details-resize'}" tag="button">Resize</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-snapshots' }"><router-link :to="{ name: 'virtual-machine-details-snapshots'}" tag="button">snapshots</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-networks' }"><router-link :to="{ name: 'virtual-machine-details-networks'}" tag="button">networks</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-security-groups' }"><router-link :to="{ name: 'virtual-machine-details-security-groups'}" tag="button">security Groups</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-console' }"><router-link :to="{ name: 'virtual-machine-details-console'}" tag="button">console</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-console-logs' }"><router-link :to="{ name: 'virtual-machine-details-console-logs'}" tag="button">console logs</router-link></li>
        <li :class="{ active : currentTab === 'virtual-machine-details-backup-services' }"><router-link :to="{ name: 'virtual-machine-details-backup-services'}" tag="button">backup</router-link></li>
        <!--<li :class="{ active : selectedTab === 'volumes' }" @click="selectTab('volumes')"><button>Storage</button></li>-->
        <li class="hidden" @click="selectedTab('Logs')"><button>Log</button><a href="#">Log</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'VirtualMachineDetailSideMenu',
  props: ['selectedTab'],
  computed: {
    currentTab () {
      return this.$route.name
    },
    selectedComponent () {
      return 'vm-' + this.currentTab
    }
  }
}
</script>
