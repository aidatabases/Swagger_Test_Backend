<template>
  <tr>
    <td>
      <span class="snap-title"><img src="@/assets/images/icon-shield.svg" alt=""> <small>{{ rule.direction }}</small></span>
    </td>
    <td>{{ rule.port_range_min }}</td>
    <td class="text-center">
      {{ remoteIpRange[0] }}
      <b style="display: block;">to</b>
      {{ remoteIpRange[1] }}
    </td>
    <td>{{ rule.protocol | uppercase }}</td>
  </tr>
</template>

<script>
import { cidrToRange } from '@/utils/Utils'
export default {
  name: 'VirtualMachineDetailSecurityGroupRow',
  props: ['rule'],
  computed: {
    remoteIpRange () {
      return cidrToRange(this.rule.remote_ip_prefix)
    }
  }
}
</script>

<style scoped>

</style>
