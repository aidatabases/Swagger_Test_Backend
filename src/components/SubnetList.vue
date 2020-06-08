<template>
  <table class="table">
    <thead>
      <tr>
        <th class="col-sm-6">Name</th>
        <th class="col-sm-3">Address</th>
        <th class="col-sm-2">IP Version</th>
        <th class="col-sm-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="subnets.length > 0">
        <tr v-for="subnet in subnets" :key="subnet.id">
          <td><strong>{{ subnet['subnet_name'] }}</strong></td>
          <td>{{ subnet['network_address'] }}</td>
          <td>{{ subnet['ip_version'] }}</td>
          <td>
            <div class="btn-group" role="group">
              <button v-tooltip.top="'Delete'" type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Delete" @click.prevent="showDeleteConfirmationModal(subnet.id)">
                <i class="fa fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      </template>
      <tr v-else>
        <td colspan="4">
          <div class="text-center">
            <h3 style="margin: 15px 0; color: rgb(144, 164, 174);">No subnet available.</h3>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import store from 'vuex-store'
import { deleteSubnet } from '../utils/NetworkUtils'
export default {
  props: ['networkId', 'subnets'],
  methods: {
    showDeleteConfirmationModal (subnetId) {
      store.dispatch('confirmation/showConfirmation', { title: 'Delete Subnet', msg: 'Are you sure you wish to delete the sub network?' })
        .then((cnf) => {
          this.deleteSubnet(subnetId)
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    deleteSubnet (subnetId) {
      deleteSubnet(this.networkId, subnetId)
    }
  }
}
</script>
