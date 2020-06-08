<template>
  <div>
    <table class="table">
      <template v-if="securityGroups.length > 0" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Attached To</th>
            <th>Rules</th>
            <th>Actions</th>
          </tr>
        </thead>
      </template>
      <tbody>
      <template v-if="securityGroups.length > 0" >
        <security-group-row v-for="securityGroup in securityGroups" :key="securityGroup.id" :p-security-group="securityGroup"></security-group-row>
      </template>
      <template v-else>
        <tr>
          <td colspan="3">
            <h3 class="text-center" style="margin: 0; color: #90A4AE;">No record found, Click on <b>Create New</b> button to create one!</h3>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="col-xs-12 clearfix">
      <pagination :records="totalSecurityGroupsRecords" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
    </div>
  </div>
</template>

<script>
import SecurityGroupsListRow from '@/views/SecurityGroupsListRow'
import { mapGetters } from 'vuex'
import { listSecurityGroups } from '../utils/SecurityGroupUtil'
import Pagination from 'vue-pagination-2'

export default {
  name: 'SecurityGroupList',
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
    securityGroupRow: SecurityGroupsListRow
  },
  computed: {
    ...mapGetters('securityGroups', ['securityGroups', 'totalSecurityGroupsRecords'])
  },

  methods: {
    fetchSecurityGroups () {
      listSecurityGroups(this.recordPerPage, this.recordOffset)
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.fetchSecurityGroups()
    }
  },

  mounted () {
    this.fetchSecurityGroups()
  }
}
</script>
