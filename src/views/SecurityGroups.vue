<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container security">
        <div class="snap-table-head clearfix">
          <h1>Security Groups</h1>
          <a class="btn btn-cloud" href="#" @click.prevent="showModal">Create New</a>
        </div>
        <security-group-list></security-group-list>
      </div>
      <security-group-create-modal :p-show="showSecurityGroupCreateModal"></security-group-create-modal>
    </div>
  </div>
</template>

<script>
import SecurityGroupCreateModal from '../components/SecurityGroupsCreateModal'
import SecurityGroupList from '../components/SecurityGroupsList'

export default {
  name: 'SecurityGroupList',
  data () {
    return {
      showSecurityGroupCreateModal: -1
    }
  },
  components: {
    securityGroupCreateModal: SecurityGroupCreateModal,
    securityGroupList: SecurityGroupList
  },

  methods: {
    showModal () {
      this.showSecurityGroupCreateModal = Math.floor(Math.random() * Math.floor(100))
    }
  }
}
</script>
