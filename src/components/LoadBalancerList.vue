<template>
  <table class="table">
    <thead>
    <tr>
      <th>Name</th>
      <th>Device IP</th>
      <th>Provider</th>
      <th>Actions</th>
    </tr>
    </thead>
    <tbody>
      <template  v-if="loadBalancers.length > 0">
        <load-balancers-list-row v-for="loadBalancer in loadBalancers" :key="loadBalancer.id" :load-balancer="loadBalancer"></load-balancers-list-row>
      </template>
      <template v-else>
        <tr>
          <td colspan="4">
            <div class="text-center padb-20">
              <h3 style="margin: 15px 0; color: rgb(144, 164, 174);">No record available.</h3>
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
import LoadBalancersListRow from '@/components/LoadBalancerListRow'

export default {
  props: ['loadBalancers'],
  components: {
    loadBalancersListRow: LoadBalancersListRow
  }
}
</script>
