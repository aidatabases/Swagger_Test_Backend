<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container role">
        <div class="snap-table-head clearfix">
          <h1>User Roles</h1>
          <router-link class="btn btn-cloud" to="/roles/create">New User Role</router-link>
        </div>
        <user-role-list :roles="userRoles"></user-role-list>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import UserRoleList from '@/components/UserRoleList'
export default {
  components: {
    userRoleList: UserRoleList
  },
  computed: {
    ...mapGetters('userRoles', ['userRoles'])
  },
  methods: {
    init () {
      store.cache.dispatch('userRoles/list', {})
    }
  },
  created () {
    this.init()
  }
}
</script>
