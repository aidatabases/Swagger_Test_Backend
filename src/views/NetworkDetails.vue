<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container network">
        <div class="row">
          <div class="col-md-12">
            <div class="snap-table-head clearfix">
              <h1>Sub Network Details</h1>
              <button class="btn btn-cloud" v-if="canWriteNetworks" @click.prevent="showCreateConfirmation">Add Sub Network</button>
            </div>
            <subnet-list :networkId="networkId" :subnets="subnets"></subnet-list>
          </div>
        </div>
      </div>
      <subnet-create-modal :p-show="showCreateSubnetModal" :network-id="networkId"></subnet-create-modal>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import SubnetList from '@/components/SubnetList'
import * as acl from '@/utils/Acls'
import SubnetCreateModal from '@/components/NetworkCreateSubnetModal'

export default {
  props: ['networkId'],
  data () {
    return {
      showCreateSubnetModal: -1
    }
  },
  components: {
    SubnetList,
    subnetCreateModal: SubnetCreateModal
  },
  computed: {
    ...acl,
    ...mapGetters('networks', ['networks']),
    network () {
      return _.filter(this.networks, { 'id': this.networkId })
    },
    subnets () {
      return this.network[0].subnet_network
    }
  },
  methods: {
    showCreateConfirmation () {
      this.showCreateSubnetModal = Math.floor(Math.random() * Math.floor(100))
    },
    createSubnet () {}
  }
}
</script>
