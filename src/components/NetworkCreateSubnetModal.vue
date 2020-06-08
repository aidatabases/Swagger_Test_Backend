<template>
  <bootstrap-modal ref="subnetCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Create Subnet</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal" @submit.prevent="validateInputs">
        <div class="form-group" :class="{ 'has-error' : $v.subnetName.$dirty && $v.subnetName.$error }">
          <label class="col-lg-3 control-label">Subnet Name</label>
          <div class="col-lg-9">
            <input class="form-control" placeholder="" v-model="subnetName" type="text">
            <span class="help-block" v-if="$v.subnetName.$dirty && !$v.subnetName.required">Please enter a subnet name.</span>
            <span class="help-block" v-else-if="$v.subnetName.$dirty && !$v.subnetName.name">Please enter a valid subnet name.</span>
            <span class="help-block" v-else-if="$v.subnetName.$dirty && (!$v.subnetName.minLength || !$v.subnetName.maxLength)">Subnet name must be minimum 4 chars and maximum 32 chars long.</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error' : $v.ipVersion.$dirty && $v.ipVersion.$error }">
          <label class="col-lg-3 control-label">IP Version</label>
          <div class="col-lg-9">
            <label class="radio-inline">
              <input type="radio" id="ipv4" v-model="ipVersion" value="4"> IPv4
            </label>
            <label class="radio-inline" v-tooltip.top="'IPv6 is not available for now.'">
              <input type="radio" id="ipv6" v-model="ipVersion" value="6" disabled> IPv6
            </label>
            <span class="help-block" v-if="$v.ipVersion.$dirty && !$v.ipVersion.required">Please choose an IP version.</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error' : $v.networkAddress.$dirty && $v.networkAddress.$error }">
          <label class="col-lg-3 control-label">Network Address</label>
          <div class="col-lg-9">
            <input class="form-control" placeholder="Network address in CIDR format (e.g. 192.168.0.0/24, 2001:DB8::/48)" v-model="networkAddress" type="text">
            <span class="help-block" v-if="$v.networkAddress.$dirty && (!$v.networkAddress.required || !$v.networkAddress.validCIDR)">Please enter a valid network address in CIDR format.</span>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="validateInputs">Create</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import bootstrapModal from 'vue2-bootstrap-modal'
import { required, minLength, maxLength, or } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { name, IPv4CIDR, IPv6CIDR } from '../lib/vuelidate/CustomValidations'
import store from 'vuex-store'

export default {
  name: 'NetworkCreateSubnetModal',
  props: {
    'pShow': Number,
    'networkId': Number
  },
  mixins: [validationMixin],
  data () {
    return {
      subnetName: '',
      ipVersion: '',
      networkAddress: ''
    }
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  validations: {
    subnetName: { name, required, minLength: minLength(4), maxLength: maxLength(32) },
    ipVersion: { required },
    networkAddress: { required, validCIDR: or(IPv4CIDR, IPv6CIDR) }
  },
  methods: {
    showModal () {
      this.clearFormFields()
      this.$refs.subnetCreateModal.open()
    },
    hideModal () {
      this.$refs.subnetCreateModal.close()
    },
    validateInputs () {
      this.$v.subnetName.$touch()
      this.$v.ipVersion.$touch()
      this.$v.networkAddress.$touch()

      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.create()
      }
    },
    clearFormFields () {
      this.$v.$reset()
      this.subnetName = ''
      this.ipVersion = ''
      this.networkAddress = ''
    },
    create () {
      this.hideModal()

      let data = {}
      data['subnet_name'] = this.subnetName
      data['ip_version'] = this.ipVersion
      data['network_address'] = this.networkAddress
      data['network_id'] = this.networkId

      store.dispatch('networks/createSubnet', { 'payload': data })
        .then(() => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'New subnet created successfully.'
          })
        })
    }
  },
  watch: {
    'pShow': function (cv, pv) {
      var that = this
      this.$nextTick(() => {
        that.showModal()
      })
    }
  }
}
</script>
