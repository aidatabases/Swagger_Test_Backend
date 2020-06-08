<template>
  <span>{{rules.length}}</span>
</template>
<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import _ from 'underscore'

export default {
  name: 'VirtualMachineCreateSecurityGroupRules',
  data: function () {
    return {
      rules: []
    }
  },
  computed: {
    ...mapGetters('securityGroupRules', ['securityGroupRulesById', 'securityGroupRules', 'cacheBurster']),
    securityGroupRulesLength: function () {
      return _.size(this.securityGroupRules)
    }
  },

  methods: {
    init () {
      store.cache.dispatch('securityGroupRules/list', { securityGroupId: 1 })
      this.rules = this.securityGroupRulesById(1)
    }
  },

  watch: {
    cacheBurster: function (val) {
      this.rules = this.securityGroupRulesById(1)
    }
  },

  created () {
    this.init()
  }
}
</script>
