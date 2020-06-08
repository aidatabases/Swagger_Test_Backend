<template>
  <tr>
    <td><span class="snap-title"><img src="@/assets/images/icon-router.png" alt=""> {{ pGatewayService.service_name }}</span></td>
    <td>
      <div class="route-meta green"> <strong>Gateway IP</strong> {{ gatewayIp }}</div>
      <div class="route-meta red"> <strong>Destination IP</strong> {{ destinationIP }} <strong v-if="destinationIP === '0.0.0.0'">(Any)</strong></div>
    </td>
    <td class="text-center">
      <div class="route-ip">{{ gatewayIp }}:<strong>{{ pGatewayService.service_gw_port }} </strong></div>
      <small><img style="transform: rotate(90deg);" src="@/assets/images/icon-right-arrow.svg" alt=""></small>
      <div class="route-ip">{{ destinationIP }}:<strong>{{destinationPort}} </strong></div>
    </td>
    <td><span class="snap-status btn-cloud">{{ pGatewayService.service_status }}</span></td>
    <td><gateway-services-row-actions :p-gateway-service="pGatewayService" @gateway-service-start="startService" @gateway-service-stop="stopService" @gateway-service-remove="removeService"></gateway-services-row-actions></td>
  </tr>
</template>
<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import GatewayServicesRowActions from '@/components/GatewayServicesRowActions'

export default {
  name: 'GatewayServicesRow',
  components: {
    gatewayServicesRowActions: GatewayServicesRowActions
  },
  props: {
    'pGatewayService': Object
  },
  computed: {
    ...mapGetters('gateway', ['gatewayIp']),
    destinationIP () {
      return this.pGatewayService.service_destination && this.pGatewayService.service_destination.split(':').length === 2 ? this.pGatewayService.service_destination.split(':')[0] : null
    },
    destinationPort () {
      return this.pGatewayService.service_destination && this.pGatewayService.service_destination.split(':').length === 2 ? this.pGatewayService.service_destination.split(':')[1] : null
    }
  },
  methods: {
    init () {
    },
    startService (gatewayServiceId) {
      store.dispatch('gateway/startService', { 'gatewayServiceId': gatewayServiceId })
    },
    stopService (gatewayServiceId) {
      store.dispatch('gateway/stopService', { 'gatewayServiceId': gatewayServiceId })
    },
    removeService (gatewayServiceId) {
      store.dispatch('gateway/removeService', { 'gatewayServiceId': gatewayServiceId })
    }
  },
  created () {
    this.init()
  }
}
</script>
