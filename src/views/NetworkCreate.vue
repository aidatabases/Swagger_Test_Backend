<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-container">
        <div class="form-row">
          <h2>New Network details</h2>
          <div>
            <form class="form-horizontal" @submit.prevent="validateInputs">
              <div class="form-group" :class="{ 'has-error' : $v.networkName.$dirty && $v.networkName.$error }">
                <label class="col-lg-3 control-label">Network Name</label>
                <div class="col-lg-9">
                  <input class="form-control" placeholder="" v-model="networkName" type="text">
                  <span class="help-block" v-if="$v.networkName.$dirty && !$v.networkName.required">Please enter a network name.</span>
                  <span class="help-block" v-else-if="$v.networkName.$dirty && !$v.networkName.name">Please enter a valid network name.</span>
                  <span class="help-block" v-else-if="$v.networkName.$dirty && (!$v.networkName.minLength || !$v.networkName.maxLength)">Network name must be minimum 4 chars and maximum 32 chars long.</span>
                </div>
              </div>
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
              <div class="form-group" :class="{ 'has-error' : $v.networkAddress.$anyError && $v.networkAddress.$dirty }">
                <label class="col-lg-3 control-label">Network Address</label>
                <div class="col-lg-9">
                  <input class="form-control" placeholder="Network address in CIDR format (e.g. 192.168.0.0/24, 2001:DB8::/48)" v-model="networkAddress" type="text">
                  <span class="help-block" v-if="$v.networkAddress.$dirty && (!$v.networkAddress.required || !$v.networkAddress.validCIDR)">Please enter a valid network address in CIDR format.</span>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" class="btn btn-cloud" value="Create Network">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import { required, minLength, maxLength, or } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import { name, IPv4CIDR, IPv6CIDR } from '../lib/vuelidate/CustomValidations'

export default {
  name: 'NetworkCreate',
  data () {
    return {
      networkName: '',
      subnetName: '',
      ipVersion: '',
      networkAddress: ''
    }
  },
  mixins: [validationMixin],
  computed: {
    ...mapGetters('auth', ['userId', 'organisationId']),
    ...mapGetters('auth', ['selectedProvider']),
    ...mapGetters('auth', ['selectedProject'])
  },
  validations: {
    networkName: {
      name,
      required,
      minLength: minLength(4),
      maxLength: maxLength(32)
    },
    subnetName: {
      name,
      required,
      minLength: minLength(4),
      maxLength: maxLength(32)
    },
    ipVersion: { required },
    networkAddress: {
      required,
      validCIDR: or(IPv4CIDR, IPv6CIDR)
    }
  },
  methods: {
    validateInputs () {
      this.$v.$touch()

      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.showConfirmation()
      }
    },
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Create Network', msg: 'Are you sure you wish to create the network?' })
        .then((cnf) => {
          this.create()
        })
    },
    create () {
      let data = {}
      data['provider_id'] = this.selectedProvider
      data['project_id'] = this.selectedProject
      data['network_name'] = this.networkName
      data['subnet_name'] = this.subnetName
      data['ip_version'] = this.ipVersion
      data['network_address'] = this.networkAddress
      data['external'] = false

      store.dispatch('networks/create', { 'providerId': this.selectedProvider, 'projectId': this.selectedProject, 'payload': data })
        .then((res) => {
          this.$router.push({ path: '/networks' })
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'New network added successfully!'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 8000,
            text: 'An error occurred while adding new network!'
          })
        })
    }
  }
}
</script>
