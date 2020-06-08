<template>
  <div class="row">
    <div class="col-xs-12">
        <gateway-services></gateway-services>
    </div>
  </div>
</template>

<script>
import GatewayServices from '@/components/GatewayServices'
export default {
  name: 'Gateway',
  components: {
    gatewayServices: GatewayServices
  }
}
</script>
