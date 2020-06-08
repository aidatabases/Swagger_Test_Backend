<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div class="snap-table-head clearfix">
        <h1>Rules <small v-if="securityGroupRules.length > 0" @click="navigateToSecurityGroup(securityGroupId)" class="navigation-link">({{ securityGroupName }} Security Group)</small></h1>
      </div>
      <table style="width:100%;" cellspacing="0">
        <thead>
        <tr>
          <th>Type</th>
          <th>Port</th>
          <th>IP Range</th>
          <th>Protocol</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="securityGroupRules.length > 0">
          <security-group-rules-row v-for="(rule) in securityGroupRules" :key="rule.id" :rule="rule"></security-group-rules-row>
        </template>
        <tr v-if="securityGroupRules.length < 1">
          <td colspan="4">
            <h3 class="text-center" style="margin: 0; color: #90A4AE;">No network attached.</h3>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import SecurityGroupRulesListRow from './VirtualMachineDetailSecurityGroupRow'
import _ from 'lodash'

export default {
  name: 'VirtualMachineDetailSecurityGroups',
  props: ['vm'],
  components: {
    securityGroupRulesRow: SecurityGroupRulesListRow
  },
  computed: {
    securityGroupId () {
      return (!_.isEmpty(this.vm)) ? this.vm.security_group.id : ''
    },
    securityGroupName () {
      return (!_.isEmpty(this.vm)) ? this.vm.security_group.security_group_name : ''
    },
    securityGroupRules () {
      return (!_.isEmpty(this.vm)) ? this.vm.security_group.security_group_rule_security_group : []
    }
  },
  methods: {
    navigateToSecurityGroup (securityGroupId) {
      this.$router.push(`/security-groups/${securityGroupId}/rules`)
    }
  }
}
</script>

<style scoped>
  .navigation-link {
    cursor: pointer;
    color: #3100cc;
  }
  .navigation-link:hover {
    color: #4b12ff;
  }
</style>
