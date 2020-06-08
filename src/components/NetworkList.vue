<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Subnet</th>
          <th>Status</th>
          <!--<th>Actions</th>-->
        </tr>
      </thead>
      <tbody>
        <network-list-row v-for="network in networks" :network="network" :key="network.id"></network-list-row>
      </tbody>
    </table>
    <div class="col-xs-12 clearfix">
      <pagination :records="totalRecords" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import NetworkListRow from '@/components/NetworkListRow'
import { listNetworks } from '../utils/NetworkUtils'
import Pagination from 'vue-pagination-2'

export default {
  name: 'NetworkList',
  data () {
    return {
      currentPage: 1,
      recordPerPage: 10,
      recordOffset: 0,
      paginationConfig: {
        chunk: 10
      }
    }
  },
  components: {
    Pagination,
    networkListRow: NetworkListRow
  },
  computed: {
    ...mapGetters('networks', ['networks', 'totalRecords'])
  },
  methods: {
    fetchNetworks () {
      listNetworks(this.recordPerPage, this.recordOffset)
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.fetchNetworks()
    }
  },
  mounted () {
    this.fetchNetworks()
  }
}
</script>
