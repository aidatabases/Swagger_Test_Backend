<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-container log">
        <div class="form-row">
          <h2>Security Scope </h2>
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
                <user-create-security-group-scopes-row v-for="(head, index) in scopeHeads" :key="index" :p-head="head" :p-selected-role-scope="[]" @scope-read-changed="readChanged" @scope-write-changed="writeChanged" :p-disabled="false" ></user-create-security-group-scopes-row>
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
  name: 'UserRoleCreateSecurityGroupScopes',
  components: {
    userCreateSecurityGroupScopesRow: UserCreateSecurityGroupScopesRow
  },
  data () {
    return {
      scopes: new Set()
    }
  },
  computed: {
    ...mapGetters('userRoleScopes', ['userRoleScopes', 'scopeHeads'])
  },
  methods: {
    writeChanged ({ scope, selected }) {
      selected ? this.scopes.add(`${scope}:write`) : this.scopes.delete(`${scope}:write`)
      this.triggerChange()
    },
    readChanged ({ scope, selected }) {
      selected ? this.scopes.add(`${scope}:read`) : this.scopes.delete(`${scope}:read`)
      this.triggerChange()
    },
    triggerChange () {
      this.$emit('user-role-create-scopes-changed', [ ...this.scopes ])
    }
  },
  created () {
    store.cache.dispatch('userRoles/list', {})
    store.cache.dispatch('userRoleScopes/list', {})
  },
  watch: {
    'scopes': function (scope) {
    },
    deep: true
  }
}
</script>
