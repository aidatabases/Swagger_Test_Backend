<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container">
        <div class="snap-table-head clearfix">
          <h1>Load Balancer</h1>
          <button type="button" class="btn btn-cloud" @click.prevent="showModal()">Create Loadbalancer</button>
        </div>
        <load-balancer-list :loadBalancers="loadBalancers"></load-balancer-list>
        <div class="col-xs-12 clearfix">
          <pagination :records="totalRecords" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
        </div>
        <lb-create-modal :p-show="showLbCreateModal" @refresh-data="init()"></lb-create-modal>
      </div>
    </div>
  </div>
</template>

<script>
import LbCreateModal from '@/components/LoadBalancerCreateModal'
import LoadBalancerList from '@/components/LoadBalancerList'
import { mapGetters } from 'vuex'
import { listLoadBalancers } from '../utils/LoadBalancerUtils'
import Pagination from 'vue-pagination-2'

export default {
  data () {
    return {
      showLbCreateModal: -1,
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
    lbCreateModal: LbCreateModal,
    loadBalancerList: LoadBalancerList
  },
  computed: {
    ...mapGetters('loadBalancers', ['loadBalancers', 'totalRecords'])
  },
  methods: {
    fetchLoadBalancers () {
      listLoadBalancers(this.recordPerPage, this.recordOffset)
    },
    showModal () {
      this.showLbCreateModal = Math.floor(Math.random() * Math.floor(100))
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.fetchLoadBalancers()
    }
  },
  mounted () {
    this.fetchLoadBalancers()
  }
}
</script>
