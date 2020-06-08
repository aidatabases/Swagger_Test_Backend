<template>
  <div class="row">
    <div class="col-xs-12">
      <gateway-services-create :p-show="showGatewayServicesCreateModal" :p-vms="virtualMachines"></gateway-services-create>
      <div class="snap-table-container router">
        <div class="snap-table-head clearfix">
          <h1>Gateway Services <small>( IP: <span class="label c-purple">{{ gatewayIp }}</span> )</small></h1>
          <a v-if="canWriteNetworks" class="btn btn-cloud" href="#" @click.prevent="showModal()">Add Service</a>
        </div>
        <table style="width:100%;" cellspacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Route</th>
              <th class="text-center">Port Mapping</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <gateway-services-row v-if="services.length > 0" v-for="service in services" :key="service.id" :p-gateway-service="service"></gateway-services-row>
            <tr v-if="services.length < 1">
              <td colspan="5">
                <h3 class="text-center" style="margin: 0; color: #90A4AE;">No record found</h3>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import * as acl from '@/utils/Acls'
import GatewayServicesRow from '@/components/GatewayServicesRow'
import GatewayServicesCreate from '@/components/GatewayServicesCreate'

export default {
  name: 'GatewayServices',
  components: {
    gatewayServicesRow: GatewayServicesRow,
    gatewayServicesCreate: GatewayServicesCreate
  },
  computed: {
    ...mapGetters('gateway', ['gateway', 'services', 'gatewayIp']),
    ...mapGetters('virtualMachines', ['virtualMachines']),
    ...acl
  },
  methods: {
    init () {
      store.cache.dispatch('gateway/details', {})
      store.cache.dispatch('gateway/listServices', {})
    },
    showModal () {
      this.showGatewayServicesCreateModal = Math.floor(Math.random() * Math.floor(100))
    }
  },
  data () {
    return {
      showGatewayServicesCreateModal: -1
    }
  },
  created () {
    this.init()
  }
}
</script>
