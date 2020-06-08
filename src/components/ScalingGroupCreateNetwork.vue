<template>
  <div class="acc-content-row has-error">
    <a class="acc-head" href="#opt-nw" data-toggle="collapse">Network</a>
    <span class="help-block" v-if="$v.selectedNetwork.$dirty && !$v.selectedNetwork.required">Please Choose one of the available Networks !</span>
    <div id="opt-nw" class="collapse in">
      <div class="snap-table-container">
        <table style="width:100%;" cellspacing="0">
          <thead>
          <tr v-if="hasInternalNetworks">
            <th class="col-md-2">Connect</th>
            <th class="col-md-2">Name</th>
            <th class="col-md-2">Description</th>
            <th class="col-md-2">Status</th>
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
                <td>{{network.network_name}}</td>
                <td>{{network.network_name}}</td>
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
      this.selectedNetwork = _.chain(this.internalNetworks)
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
