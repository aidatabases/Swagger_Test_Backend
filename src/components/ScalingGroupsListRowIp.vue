<template>
  <td>
    <div class="ip-meta">
      <span class="ip-status c-gray">IP</span>
      <span v-if="!!loadBalancerIp" class="snap-status c-yellow"> {{ loadBalancerIp }}</span>
      <span v-else class="snap-status c-gray">UNAVAILABLE</span>
    </div>
  </td>
</template>

<script>
export default {
  name: 'ScalingGroupsListRowIp',
  props: ['pLbVmIp'],
  computed: {
    loadBalancerIp () {
      return this.pLbVmIp
    }
  }
}
</script>
