<template>
  <div class="acc-content-row has-error">
    <a class="acc-head" href="#opt-security" data-toggle="collapse">Security Groups</a>
    <span class="help-block" v-if="$v.selectedSecurityGroups.$dirty && !$v.selectedSecurityGroups.required">Please Choose one of the available Security Groups !</span>
    <div id="opt-security" class="collapse in">
      <div class="snap-table-container">
        <table class="table table-condensed">
          <thead>
            <tr v-if="hasSecurityGroups">
              <th class="col-md-1">Use</th>
              <th class="col-md-6">Name</th>
              <th class="col-md-2">Rules</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="hasSecurityGroups">
              <tr v-for="sg in nonGwSecurityGroup" :key="sg.id">
                <td>
                  <div class="radio-opt">
                    <label>
                      <input name="securityGroup" id="optionRadio" type="radio" :value="sg.id" v-model="selectedSecurityGroups">
                      <span class="switch-round"></span>
                    </label>
                  </div>
                </td>
                <td>{{sg.security_group_name}}</td>
                <td><router-link title="details" :to="{ name: 'security-group-rules', params: { 'pSecurityGroupId': sg.id }}" target="_blank"> (Applied Rules) </router-link></td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="3">
                <span>No Security Group Found Click <router-link title="list" :to="{ name: 'security-groups'}"> here </router-link> to create One !</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'underscore'
import { validationMixin } from 'vuelidate'
import cloudValidationMixin from '@/components/mixin/Validation'
import { required } from 'vuelidate/lib/validators'
import { listNonGWLBSecurityGroups } from '../utils/SecurityGroupUtil'

export default {
  name: 'VirtualMachineCreateSecurityGroups',
  mixins: [validationMixin, cloudValidationMixin],

  props: {
    'vmSecurityGroups': Number
  },

  data: function () {
    return {
      'selectedSecurityGroups': this.vmSecurityGroups,
      'nonGwSecurityGroup': []
    }
  },

  validations: {
    selectedSecurityGroups: {
      required
    }
  },

  computed: {
    hasSecurityGroups: function () {
      return this.nonGwSecurityGroup.length > 0
    }
  },
  methods: {
    init () {
      let _this = this
      listNonGWLBSecurityGroups()
        .then((sgs) => {
          _this.nonGwSecurityGroup = sgs
          _this.selectRandom()
        })
    },
    selectRandom () {
      this.selectedSecurityGroups = _.chain(this.nonGwSecurityGroup)
        .pluck('id')
        .sample()
        .value()
    }
  },
  created () {
    this.init()
  },
  watch: {
    'selectedSecurityGroups': function (securityGroups, ov) {
      this.$emit('vm-security-groups-changed', securityGroups)
    }
  }
}
</script>
