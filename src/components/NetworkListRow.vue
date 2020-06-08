<template>
    <tr>
      <td>
        <span class="snap-title">
          <img src="@/assets/images/icon-network-blue.svg" alt="">
          <router-link :to="{ name: 'network-detail', params: { 'networkId': network['id'] }}">
            {{ network['network_name'] }}
          </router-link>
        </span>
      </td>
      <td><strong>{{ networkType }}</strong></td>
      <td>
          <ul>
            <li v-for="subnet in subnets" :key="subnet['id']"><strong>{{ subnet['subnet_name'] }}</strong> (<span>{{ subnet['network_address'] }}</span>)</li>
          </ul>
      </td>
      <td>
        <span class="label c-purple">{{ network.status }}</span>
      </td>
      <!--<td>
        <div class="btn-group" role="group">
          <button v-tooltip.top="'Add Subnet'" type="button" class="btn btn-default hidden" data-toggle="tooltip" data-placement="top" title="Add Subnet" @click.prevent="">
            <i class="fa fa-plus"></i>
          </button>
          <button v-tooltip.top="'Delete Network'" type="button" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Delete" @click.prevent="deleteNetwork">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </td>-->
    </tr>
</template>

<script>
import _ from 'lodash'
import { deleteNetwork } from '../utils/NetworkUtils'

export default {
  name: 'NetworkListRow',
  props: ['network'],
  computed: {
    networkId () {
      return this.network['id']
    },
    subnets () {
      return this.network.subnet_network
    },
    // subnetAddress () {
    //   return this.network.subnet_network['subnet_cidr']
    // },
    isSubnetAvailable () {
      return _.size(this.network.subnet_network) > 0
    },
    networkType () {
      if (this.network.external) {
        return 'External'
      }
      return 'Internal'
    }
  },
  methods: {
    deleteNetwork () {
      if (this.isSubnetAvailable) {
        alert('Please delete all subnet first')
        return false
      }
      deleteNetwork(this.networkId)
    }
  }
}
</script>
