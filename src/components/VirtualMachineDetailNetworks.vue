<template>
  <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
    <div class="snap-table-container">
      <div class="snap-table-head clearfix">
        <h2>Attached Networks</h2>
      </div>
      <table class="table">
        <thead>
        <tr>
          <th>Name</th>
          <th>IP Address</th>
          <th>Type</th>
          <th>Attached</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
          <network-list v-for="network in internalNetworks"
                        :key="network.id"
                        :network="network">
          </network-list>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { listNetworks } from '../utils/NetworkUtils'
import NetworkList from './VirtualMachineDetailNetworksListRow'

export default {
  name: 'VirtualMachineDetailNetworks',
  components: { NetworkList },
  data () {
    return {
      networks: []
    }
  },
  computed: {
    internalNetworks () {
      return this.networks.filter((nw) => !nw.external)
    }
  },
  created () {
    let _this = this
    listNetworks()
      .then((networks) => {
        _this.networks = networks
      })
  }
}
</script>
