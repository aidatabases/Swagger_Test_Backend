<template>
  <tr>
    <td>
      <span class="snap-title"><img src="@/assets/images/icon-ingress.svg" alt=""> {{ direction }}</span>
    </td>
    <td class="text-center">{{port}}</td>
    <td v-if="remoteIpRange === 'ANY'" class="text-center">ANY</td>
    <td v-else class="text-center">
      {{remoteIpRange[0]}}
      <b style="display: block;">to</b>
      {{remoteIpRange[1]}}
    </td>
    <td class="text-center">{{ protocol | uppercase }}</td>
    <td class="text-center">
      <div class="btn-group">
        <a href="" @click.prevent="removeRule"><i class="text-danger fa fa-trash fa-lg"></i></a>
      </div>
    </td>
  </tr>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import { cidrToRange } from '@/utils/Utils'
export default {
  name: 'SecurityGroupRulesListRow',

  props: {
    'pSecurityGroupRule': {
      type: Object,
      default: {}
    }
  },
  computed: {
    ...mapGetters('providers', ['getSelectedProviderName']),
    ...mapGetters('gateway', ['gatewayIp']),
    direction () {
      return this.pSecurityGroupRule.direction
    },
    port () {
      return this.pSecurityGroupRule.port_range_min ? this.pSecurityGroupRule.port_range_min : 'ANY'
    },
    protocol () {
      return this.pSecurityGroupRule.protocol ? this.pSecurityGroupRule.protocol : 'ANY'
    },
    remoteIp () {
      return this.pSecurityGroupRule.remote_ip_prefix
    },
    remoteIpRange () {
      if (this.remoteIp) {
        return cidrToRange(this.remoteIp)
      }
      return 'ANY'
    },
    ruleId () {
      return this.pSecurityGroupRule.id
    }
  },
  methods: {
    removeRule () {
      store.dispatch('confirmation/showConfirmation', { title: 'Remove Security Rule', msg: 'Your action will Remove this Rule, Are you sure to perform this action ? ' })
        .then((cnf) => {
          this.$emit('security-group-rule-remove', this.ruleId)
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    }
  }
}
</script>
