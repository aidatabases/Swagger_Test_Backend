<template>
  <form @submit.prevent="validatePostData">
    <div class="form-container rule">
      <div class="form-row">
        <h2>New Security Group Rule</h2>
        <div class="row">
          <div class="col-md-3">
            <div class="form-group" :class="{ 'has-error': $v.protocol.$dirty && $v.protocol.$error }">
              <label class="control-label">Type</label>
              <select class="form-control" v-model="protocol">
                <option value=''>Select</option>
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group" :class="{ 'has-error': $v.etherType.$dirty && $v.etherType.$error }">
              <label class="control-label">IP Version</label>
              <select class="form-control" v-model="etherType">
                <option value=''>Select</option>
                <option value="IPv4">IP V4</option>
                <option disabled value="IPv6">IP V6</option>
              </select>
            </div>
          </div>
          <div class="col-md-5">
            <div class="form-group" :class="{ 'has-error': $v.direction.$dirty && $v.direction.$error }">
              <label class="control-label">Direction</label>
              <select class="form-control" v-model="direction">
                <option value=''>Select</option>
                <option value="ingress">Inbound</option>
                <option value="egress">Outbound</option>
              </select>
            </div>
          </div>
          <div class="col-md-12 hidden">
            <div class="form-group">
              <label >Name</label>
              <input class="form-control" placeholder="" v-model="name" type="text">
            </div>
          </div>
          <div class="col-md-7">
            <div class="form-group">
              <label>Predefined Ports</label>
              <select class="form-control" @change="predefinedProtocolSelected">
                <option value=''>Select</option>
                <option v-for="option in predefinedProtocols" :value="option.port" :key="option.id">
                  {{ option.displayValue }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-5">
            <div class="form-group" :class="{ 'has-error': $v.port.$dirty && $v.port.$error }">
              <label class="control-label">Port</label>
              <input class="form-control" placeholder="" v-model="port" type="number">
            </div>
          </div>
          <div class="col-md-7">
            <div class="form-group" :class="{ 'has-error': $v.ip.$dirty && $v.ip.$error }">
              <label class="control-label">IP</label>
              <vue-ip-input class="form-control" :on-change="ipChange" :ip="ip"></vue-ip-input>
            </div>
          </div>
          <div class="col-md-5">
            <div class="form-group" :class="{ 'has-error': $v.networkBit.$dirty && $v.networkBit.$error }">
              <label class="control-label">Network Bit</label>
              <input class="form-control" placeholder="" v-model="networkBit" type="number">
            </div>
          </div>
          <div class="text-center col-md-12">
            <input type="submit" class="btn btn-cloud" value="Add Rule">
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required, ipAddress } from 'vuelidate/lib/validators'
import vueIpInput from '../components/elements/vue-ip-input/VueIpInput'
import { getOne } from '../utils/SecurityGroupUtil'

export default {
  name: 'VolumeCreate',
  components: { vueIpInput },
  props: {
    pSecurityGroupId: String | Number
  },
  mixins: [validationMixin],
  data () {
    return {
      name: '',
      direction: '',
      networkBit: 0,
      ip: '',
      port: '',
      etherType: '',
      protocol: ''
    }
  },
  computed: {
    ...mapGetters('auth', [
      'userId',
      'organisationId'
    ]),
    ...mapGetters('auth', [
      'selectedProvider'
    ]),
    ...mapGetters('auth', [
      'selectedProject'
    ]),
    securityGroupId () {
      return parseInt(this.pSecurityGroupId)
    },
    predefinedProtocols () {
      return [
        {
          'id': 'http',
          'protocol': 'tcp',
          'displayValue': 'HTTP',
          'port': '80'
        },
        {
          'id': 'https',
          'protocol': 'tcp',
          'displayValue': 'HTTPS',
          'port': '443'
        },
        {
          'id': 'ssh',
          'protocol': 'tcp',
          'displayValue': 'SSH',
          'port': '22'
        },
        {
          'id': 'tcp',
          'protocol': 'tcp',
          'displayValue': 'Custom TCP Rule'
        },
        {
          'id': 'udp',
          'protocol': 'udp',
          'displayValue': 'Custom UDP Rule'
        }
      ]
    }
  },
  mounted () {
    this.resetFormData()
    this.$v.$reset()
  },
  methods: {
    predefinedProtocolSelected (event) {
      this.port = event.target.value
    },
    ipChange (ip, port, valid) {
      this.ip = ip
    },
    validatePostData () {
      this.$v.$touch()

      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      }
      this.showConfirmation()
    },
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Create Security Rule', msg: 'Are you sure you wish to create Security Rule?' })
        .then((cnf) => {
          this.create()
        })
    },
    resetFormData () {
      this.name = ''
      this.direction = ''
      this.networkBit = 0
      this.ip = '...'
      // this.port = ''
      this.etherType = ''
      this.protocol = ''
    },
    create () {
      store.cache.delete('securityGroups/list')
      let data = {}
      data['user_id'] = this.userId
      data['port_range_min'] = this.port
      data['port_range_max'] = this.port
      data['ethertype'] = this.etherType
      data['remote_ip_prefix'] = this.ip + '/' + this.networkBit
      data['direction'] = this.direction
      data['protocol'] = this.protocol
      data['security_group_id'] = this.securityGroupId
      let _this = this

      store.dispatch('securityGroupRules/create', { securityGroupId: this.securityGroupId, payload: data })
        .catch(({ response }) => {
          this.error_msg = `response ${response.statusText}`
          this.$notify({
            group: 'app',
            title: 'Error while creating Rule.',
            text: `We encountered error ${this.error_msg}!`
          })
          // this.$refs['fail-notification'].show()
        }).finally(() => {
          _this.$v.$reset()
          _this.resetFormData()
          getOne(this.securityGroupId)
          // store.dispatch('securityGroups/list')
        })
    }
  },
  validations: {
    port: { required },
    etherType: { required },
    ip: { required, ipAddress },
    networkBit: { required },
    direction: { required },
    protocol: { required }
  }
}
</script>
<style>
.vue-ip.material-theme input[type='number']{
  color: black !important;
}
.vue-ip.material-theme .segment:after {
  color: black !important;
}
.vue-ip.material-theme {
  border-bottom: 1px solid #cccccc !important;
}
.has-error>.vue-ip.material-theme {
  border-bottom: 1px solid #a94442 !important;
}
</style>
