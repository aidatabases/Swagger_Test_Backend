<template>
  <div class="row">
    <div class="col-md-7">
      <div class="snap-table-container rule">
        <div class="snap-table-head clearfix">
          <h1> Associated Rules<br><small>({{securityGroupDetails.security_group_name}})</small></h1>
        </div>
        <table style="width:100%;" cellspacing="0">
          <thead>
            <tr >
              <th class="text-center">Type</th>
              <th class="text-center">Port</th>
              <th class="text-center">Ip Range</th>
              <th class="text-center">Protocol</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="rules.length > 0">
              <security-group-rule-row @security-group-rule-remove="removeRule" v-for="rule in rules" :key="rule.id" :p-security-group-rule="rule"></security-group-rule-row>
            </template>
            <template v-else>
              <tr>
                <td colspan="5">
                  <div class="text-center">
                    <h4 style="margin: 15px 0; color: rgb(144, 164, 174);">No rules available.</h4>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="col-md-5">
      <security-group-rule-create :p-security-group-id="pSecurityGroupId"></security-group-rule-create>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import SecurityGroupRulesListRow from '@/views/SecurityGroupRulesListRow'
import SecurityGroupRulesCreate from '@/views/SecurityGroupRulesCreate'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'SecurityGroupRulesList',
  components: {
    securityGroupRuleRow: SecurityGroupRulesListRow,
    securityGroupRuleCreate: SecurityGroupRulesCreate
  },
  props: {
    pSecurityGroupId: Number
  },
  computed: {
    ...mapGetters('securityGroups', ['securityGroups', 'securityGroupById']),
    securityGroupId () {
      return parseInt(this.pSecurityGroupId)
    },
    securityGroupDetails () {
      return this.securityGroupById(this.securityGroupId)
    },
    rules () {
      let _this = this
      let rules = []
      let securityGroups = _.filter(this.securityGroups, { id: _this.securityGroupId })
      // return this.securityGroupRulesById(this.securityGroupId)
      if (securityGroups) {
        rules = securityGroups[0]['security_group_rule_security_group']
      }
      return rules
    }
  },
  methods: {
    removeRule (securityGroupRuleId) {
      store.dispatch('securityGroupRules/remove', {
        'securityGroupId': this.securityGroupId,
        'securityGroupRuleId': securityGroupRuleId
      })
        .finally(() => {
          store.dispatch('securityGroups/list')
        })
    }
  }
}
</script>
