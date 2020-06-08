<template>
  <tr>
    <td>
      <span class="snap-title">
        <img src="@/assets/images/icon-shield.svg" alt="">
        <router-link :to="`/security-groups/${id}/rules`">{{ name }}</router-link>
      </span>
    </td>
    <td>
      <span class="label label-warning" v-if="isGateway">Gateway</span>
      <span class="label label-info" v-else-if="isLB">Load Balancer</span>
      <span class="label label-success" v-else-if="isVM">Virtual Machine</span>
      <span class="label label-default" v-else>None</span>
    </td>
    <td>
      <div class="sec-grp">
        <router-link class="btn btn-cloud" title="details" :to="{ name: 'security-group-rules', params: { 'pSecurityGroupId': id }}">
          Applied Rules
          <span>{{ noOfSecurityGroupRules }}</span>
        </router-link>
      </div>
    </td>
    <td>
      <div class="btn-group" role="group">
        <button class="btn btn-danger" title="Delete Security Group" @click.prevent="showConfirmation" :disabled="isDeletionAllowed">
          <i class="fa fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script>
import { deleteSecurityGroup } from '../utils/SecurityGroupUtil'
import store from 'vuex-store'

export default {
  name: 'SecurityGroupsListRow',
  props: {
    'pSecurityGroup': {
      type: Object,
      default: {}
    }
  },
  computed: {
    isGateway () {
      return this.pSecurityGroup.is_gw_security_group
    },
    isLB () {
      return this.pSecurityGroup.is_lb_security_group
    },
    isVM () {
      return this.pSecurityGroup.compute_security_group.length > 0
    },
    name () {
      return this.pSecurityGroup.security_group_name
    },
    id () {
      return this.pSecurityGroup.id
    },
    noOfSecurityGroupRules () {
      if (this.pSecurityGroup.hasOwnProperty('security_group_rule_security_group')) {
        return this.pSecurityGroup.security_group_rule_security_group.length
      } else {
        return 0
      }
    },
    isDeletionAllowed () {
      return (this.isGateway || this.isLB || this.isVM || this.pSecurityGroup.security_group_name === 'default')
    }
  },
  methods: {
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Delete Security Group', msg: 'Are you sure you wish to delete the Security Group?' })
        .then((cnf) => {
          deleteSecurityGroup(this.id)
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    }
  }
}
</script>

<style scoped>
  .label {
    width: 100px;
    display: inline-block;
    padding: .4em .6em .4em;
  }
</style>
