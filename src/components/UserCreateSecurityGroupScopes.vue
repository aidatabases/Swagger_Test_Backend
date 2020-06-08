<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-container log">
        <div class="form-row">
          <h2>Security Scope <small>({{ userRole.group_name }})</small></h2>
          <div class="row">
            <div class="col-md-12">
            <table style="width: 100%" cellspacing="0">
              <thead>
                <tr>
                  <th>Scope</th>
                  <th>Read</th>
                  <th>Write</th>
                </tr>
              </thead>
              <tbody>
                <user-create-security-group-scopes-row v-for="(head, index) in scopeHeads" :key="index" :p-head="head" :p-disabled="true" :p-selected-role-scope="selectedRoleScope" ></user-create-security-group-scopes-row>
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import UserCreateSecurityGroupScopesRow from '@/components/UserCreateSecurityGroupScopesRow'

export default {
  name: 'UserCreateSecurityGroupScopes',
  props: {
    pRoleId: Number
  },
  components: {
    userCreateSecurityGroupScopesRow: UserCreateSecurityGroupScopesRow
  },
  computed: {
    ...mapGetters('userRoles', ['userRoleById']),
    ...mapGetters('userRoleScopes', ['userRoleScopes', 'scopeHeads']),
    userRole () {
      return this.userRoleById(this.pRoleId) ? this.userRoleById(this.pRoleId) : {}
    },
    selectedRoleScope () {
      return this.userRoleById(this.pRoleId) ? this.userRoleById(this.pRoleId).scope : []
    },
    scopes () {
      return this.userRoleScopes.scope_list
    }
  },
  created () {
    store.cache.dispatch('userRoles/list', {})
    store.cache.dispatch('userRoleScopes/list', {})
  }
}
</script>
