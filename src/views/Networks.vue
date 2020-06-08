<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="snap-table-container network">
                <div class="snap-table-head clearfix">
                    <h1>Networks</h1>
                    <router-link class="btn btn-cloud" to="/networks/create">Add Network</router-link>
                </div>
                <network-list></network-list>
            </div>
            <network-create-subnet-modal :p-show="showNetworkCreateSubnetModal"></network-create-subnet-modal>
        </div>
    </div>
</template>

<script>
import NetworkList from '@/components/NetworkList'
import NetworkCreateSubnetModal from '../components/NetworkCreateSubnetModal'

export default {
  name: 'Networks',
  data () {
    return {
      showNetworkCreateSubnetModal: -1
    }
  },
  components: {
    NetworkList,
    NetworkCreateSubnetModal
  }
}
</script>
