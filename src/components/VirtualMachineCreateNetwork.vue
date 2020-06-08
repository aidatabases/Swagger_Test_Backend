<template>
  <div class="acc-content-row has-error">
    <a class="acc-head" href="#opt-nw" data-toggle="collapse">Network</a>
    <span class="help-block" v-if="$v.selectedNetwork.$dirty && !$v.selectedNetwork.required">Please Choose one of the available Networks !</span>
    <div id="opt-nw" class="collapse in">
      <div class="snap-table-container">
        <table class="table table-condensed">
          <thead>
            <tr v-if="hasInternalNetworks">
              <th class="col-md-1">Connect</th>
              <th class="col-md-3">Name</th>
              <th class="col-md-5">Subnet</th>
              <th class="col-md-1">Status</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="hasInternalNetworks">
              <tr v-for="network in availableNetworks" :key="network.id">
                <td>
                  <div class="radio-opt">
                    <label>
                      <input name="optionRadio" id="optionRadio" type="radio" :value="network.id" v-model="selectedNetwork">
                      <span class="switch-round"></span>
                    </label>
                  </div>
                </td>
                <td>
                  <router-link :to="{ name: 'network-detail', params: { 'networkId': network['id'] }}">
                    {{ network['network_name'] }}
                  </router-link>
                </td>
                <td>
                  <ul>
                    <li v-for="subnet in network.subnet_network" :key="subnet['id']"><strong>{{ subnet['subnet_name'] }}</strong> (<span>{{ subnet['network_address'] }}</span>)</li>
                  </ul>
                </td>
                <td><span class="snap-status c-green">UP</span></td>
              </tr>
            </template>
            <tr v-else>
              No network Found Click here to create One
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import store from 'vuex-store'
import _ from 'underscore'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import cloudValidationMixin from '@/components/mixin/Validation'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'VirtualMachineCreateNetworks',
  props: {
    'vmNetwork': Number
  },
  mixins: [validationMixin, cloudValidationMixin],

  data: function () {
    return {
      'selectedNetwork': this.vmNetwork
    }
  },

  validations: {
    selectedNetwork: {
      required
    }
  },

  computed: {
    ...mapGetters('networks', ['networks', 'internalNetworks']),
    hasInternalNetworks: function () {
      return this.availableNetworks.length > 0
    },
    availableNetworks: function () {
      let _this = this
      if (!_.isEmpty(_this.internalNetworks)) {
        return _.filter(_this.internalNetworks, function (i) {
          return i.subnet_network.length > 0
        })
      }
      return this.internalNetworks
    }
  },
  methods: {
    init () {
      let _this = this
      store.cache.dispatch('networks/list', {})
        .then(() => {
          _this.selectRandom()
        })
    },
    selectRandom () {
      this.selectedNetwork = _.chain(this.availableNetworks)
        .pluck('id')
        .sample()
        .value()
    }
  },
  created () {
    this.init()
  },

  watch: {
    'selectedNetwork': function (cv, ov) {
      this.$emit('vm-network-changed', this.selectedNetwork)
    },

    'networks': function (cv, pv) {
      if (_.isEmpty(this.selectedNetwork)) {
        this.selectRandom()
      }
    }
  }
}
</script>
