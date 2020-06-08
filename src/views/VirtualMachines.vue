<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container fip vm">
        <div class="snap-table-head clearfix">
          <h1>Virtual Machines<small> ( Gateway <span class="label c-purple"> {{ gatewayIp }}</span> )</small></h1>
          <a class="btn btn-sm btn-warning header-btn" :href="'http://' + gatewayIp + ':8443'" target="_blank">Monitoring Dashboard</a>
          <router-link class="btn btn-sm btn-warning header-btn" to="/virtual-machines/create">Create New VM</router-link>
        </div>
        <div>
          <search-box @list-count-changed="changeListCount" @search-query-triggered="filterVms" @clear-search-triggered="clearSearch"></search-box>
        </div>
        <!--<div class="table-responsive">-->
          <virtual-machines-list></virtual-machines-list>
        <!--</div>-->
      </div>
    </div>
    <div class="col-xs-12 clearfix">
        <pagination :records="totalVmCount" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
    </div>
    <vm-log-modal :p-show="showVmLogModal"></vm-log-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'
import VirtualMachinesList from '@/components/VirtualMachineList'
import VirtualMachineLogModal from '@/components/VirtualMachineLogModal'
import Pagination from 'vue-pagination-2'
import { listVms, filterVms } from '@/utils/VirtualMachinesUtil'
import SearchBox from '../components/_common/SearchBox'

export default {
  data () {
    return {
      showVmLogModal: -1,
      currentPage: 1,
      recordPerPage: 10,
      recordOffset: 0,
      paginationConfig: {
        chunk: 10
      }
    }
  },
  components: {
    virtualMachinesList: VirtualMachinesList,
    vmLogModal: VirtualMachineLogModal,
    pagination: Pagination,
    SearchBox
  },
  computed: {
    ...mapGetters('gateway', ['gatewayIp']),
    ...mapGetters('virtualMachines', ['totalVmRecords']),
    totalVmCount () {
      return parseInt(this.totalVmRecords, 10)
    }
  },
  methods: {
    loadVms () {
      listVms(this.recordPerPage, this.recordOffset)
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.loadVms()
    },
    filterVms (query) {
      filterVms(query, this.recordPerPage, this.recordOffset)
    },
    clearSearch () {
      this.recordPerPage = 10
      this.paginationConfig.chunk = 10
      this.recordOffset = 0
      this.loadVms()
    },
    changeListCount (count) {
      this.recordPerPage = parseInt(count)
      this.paginationConfig.chunk = parseInt(count)
      this.recordOffset = 0
      this.loadVms()
    }
  },
  mounted () {
    store.cache.dispatch('gateway/details', {})
    this.loadVms()
  }
}
</script>

<style>
  .header-btn { margin-left: 10px; }
</style>
