<template>
  <bootstrap-modal ref="gatewayServiceCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Creating new Gateway Service</h4>
    </div>
    <div slot="body">
      <div class="form-group" :class="{ 'has-error': $v.serviceName.$dirty && $v.serviceName.$error }">
        <label class="control-label">Service Name:</label>
        <input type="text" class="form-control" name="serviceName" v-model="serviceName">
        <span class="help-block" v-if="$v.serviceName.$error && !$v.serviceName.required">Service name is required</span>
        <span class="help-block" v-else-if="$v.serviceName.$error && !$v.serviceName.minLength">Name should be minimum 4 characters long</span>
        <span class="help-block" v-else-if="$v.serviceName.$error && !$v.serviceName.name">Please enter a valid name. Only alphabets, numbers and hyphen is allowed.</span>
      </div>
      <div class="form-group" :class="{ 'has-error': $v.serviceProtocol.$dirty && $v.serviceProtocol.$error }">
        <label class="control-label">Service Protocol:</label>
        <select name="serviceProtocol" class="form-control" v-model="serviceProtocol">
          <option value="">Select</option>
          <option value="tcp">TCP</option>
          <option value="udp">UDP</option>
        </select>
        <span class="help-block" v-if="$v.serviceProtocol.$dirty && !$v.serviceProtocol.required">Service Protocol is required</span>
      </div>
      <div class="form-group" :class="{ 'has-error': $v.serviceGatewayPort.$dirty && $v.serviceGatewayPort.$error }">
        <label class="control-label">Gateway Port:</label>
        <input name="serviceGatewayPort" type="text" class="form-control" v-model="serviceGatewayPort">
        <span class="help-block" v-if="$v.serviceGatewayPort.$dirty && !$v.serviceGatewayPort.required">Gateway Port is required</span>
        <span class="help-block" v-if="$v.serviceGatewayPort.$dirty && !$v.serviceGatewayPort.numeric">Enter a valid port number</span>
        <span class="help-block" v-if="$v.serviceGatewayPort.$dirty && !$v.serviceGatewayPort.minLength">Enter a valid port number</span>
      </div>
      <div class="form-group" :class="{ 'has-error': $v.serviceDestination.$dirty && $v.serviceDestination.$error }">
        <label class="control-label">Destination:</label>
        <select name="serviceDestination" class="form-control" v-model="serviceDestination">
          <option value="">Select</option>
          <option v-for="pVm in pVms" :key="pVm.id" :value="pVm.private_ip">{{ pVm.private_ip }} ( {{pVm.instance_name}} )</option>
        </select>
        <span class="help-block" v-if="$v.serviceDestination.$dirty && !$v.serviceDestination.required">Service Destination is required</span>
      </div>
      <div class="form-group" :class="{ 'has-error': $v.serviceDestinationPort.$dirty && $v.serviceDestinationPort.$error }">
        <label class="control-label">Destination Port:</label>
        <input type="text" class="form-control" name="serviceDestinationPort" v-model="serviceDestinationPort">
        <span class="help-block" v-if="$v.serviceDestinationPort.$dirty && !$v.serviceDestinationPort.required">Destination Port is required</span>
        <span class="help-block" v-if="$v.serviceDestinationPort.$dirty && !$v.serviceDestinationPort.numeric">Enter a valid port number</span>
      </div>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="create">Create</button>
      <button type="button" class="btn btn-default" @click.prevent="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required, minLength, numeric } from 'vuelidate/lib/validators'
import { name } from '../lib/vuelidate/CustomValidations'

export default {
  name: 'gatewayServiceCreate',
  components: {
    bootstrapModal: bootstrapModal
  },
  props: {
    'pShow': Number,
    'pVms': Array
  },
  mixins: [validationMixin],
  data () {
    return {
      serviceName: '',
      serviceProtocol: '',
      serviceGatewayPort: '',
      serviceDestination: '',
      serviceDestinationPort: ''
    }
  },
  validations: {
    serviceName: { required, name, minLength: minLength(4) },
    serviceProtocol: { required },
    serviceGatewayPort: { required, numeric, minLength: minLength(2) },
    serviceDestination: { required },
    serviceDestinationPort: { required, numeric, minLength: minLength(2) }
  },
  computed: {
    ...mapGetters('auth', [
      'organisationId', 'selectedProject', 'selectedProvider'
    ])
  },
  methods: {
    clearForm () {
      this.serviceName = ''
      this.serviceProtocol = ''
      this.serviceGatewayPort = ''
      this.serviceDestination = ''
      this.serviceDestinationPort = ''
      this.$v.$reset()
    },
    showModal () {
      this.clearForm()
      this.$refs.gatewayServiceCreateModal.open()
    },
    hideModal () {
      this.$refs.gatewayServiceCreateModal.close()
    },
    create () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return
      }

      let data = {}
      data['service_name'] = this.serviceName
      data['service_protocol'] = this.serviceProtocol
      data['service_gw_port'] = this.serviceGatewayPort
      data['service_destination'] = this.serviceDestination + ':' + this.serviceDestinationPort
      data['project_id'] = this.selectedProject
      data['provider_id'] = this.selectedProvider

      store.dispatch('gateway/createService', { projectId: this.selectedProject, providerId: this.selectedProvider, payload: data })
        .then(() => {
          this.hideModal()
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
