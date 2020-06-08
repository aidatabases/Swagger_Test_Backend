<template>
  <div class="row">
    <div class="col-sm-8" :class="{ 'has-error': $v.applicationName.$dirty && $v.applicationName.$error }">
      <input v-model="applicationName" type="text" class="form-control" placeholder="Enter Application Name">
      <span class="help-block" v-if="$v.applicationName.$dirty">Please enter a valid Application Name</span>
    </div>
    <div class="radio">
      <label class="radio-inline">
        <input type="radio" name="optionsRadios" v-model="aadharCompliance" value="no"/> No
        <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Click if application is not aadhar compliance'"></i>
      </label>
      <label class="radio-inline">
        <input type="radio" name="optionsRadios" v-model="aadharCompliance" value="yes" /> Yes
        <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Click if your application is aadhar compliance'"></i>
      </label>
    </div>
    <div class="form-group" :class="{ 'has-error': $v.routableIp.$dirty && $v.routableIp.$error }">
      <label class="col-sm-2 control-label">Routable IP</label>
      <div class="col-sm-10">
        <select v-model="routableIp" class="form-control">
          <option value="">Select</option>
          <option :value="ip.routable_ip" v-for="ip in availableRoutableIPs" :key="ip.routable_ip">{{ ip.routable_ip }} ({{ ip.attached_with }})</option>
        </select>
        <span class="help-block" v-if="$v.routableIp.$dirty">Please enter a valid Routable IP</span>
      </div>
    </div>
    <div class="col-sm-8" :class="{ 'has-error': $v.applicationUrl.$dirty && $v.applicationUrl.$error }">
      <input v-model="applicationUrl" type="text" class="form-control" placeholder="Enter Url of the application">
      <span class="help-block" v-if="$v.applicationUrl.$dirty">Please enter a valid Application URL</span>
    </div>
    <div class="col-sm-8" :class="{ 'has-error': $v.aadharCompliance.$dirty && $v.aadharCompliance.$error }">
      <input v-model="aadharCompliance" type="text" class="form-control" placeholder="Is application Aadhar Compliance">
      <span class="help-block" v-if="$v.aadharCompliance.$dirty">Please enter a valid Application Name</span>
    </div>
    <div class="col-sm-8" :class="{ 'has-error': $v.routableIp.$dirty && $v.routableIp.$error }">
      <input v-model="routableIp" type="text" class="form-control" placeholder="Enter Application Name">
      <span class="help-block" v-if="$v.routableIp.$dirty">Please enter a valid Routable IP</span>
    </div>
    <div class="col-sm-8" :class="{ 'has-error': $v.routableIpAttachedWith.$dirty && $v.routableIpAttachedWith.$error }">
      <input v-model="routableIpAttachedWith" type="text" class="form-control" placeholder="Enter Public IP">
      <span class="help-block" v-if="$v.routableIpAttachedWith.$dirty">Please enter a valid Public IP</span>
    </div>
    <div class="col-sm-4">
      <button type="button" class="btn btn-lg btn-cloud btn-block" @click.prevent="requestPublicIP()">Request Public IP</button>
    </div>
  </div>
</template>
<script>
import store from 'vuex-store'
import { validationMixin } from 'vuelidate'
import { requestPublicIP as requestIP, listRoutableIPByOrganisationProviderAndProject } from '@/utils/PublicIPUtil'
import { mapGetters } from 'vuex'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'PublicIPRequest',
  props: {
    'computeId': String
  },
  data () {
    return {
      applicationName: '',
      applicationUrl: '',
      aadharCompliance: 'yes',
      routableIp: '',
      routableIpAttachedWith: ''
    }
  },
  validations: {
    applicationName: { required },
    applicationUrl: { required },
    aadharCompliance: { required },
    routableIp: { required },
    routableIpAttachedWith: { required }
  },
  mixins: [validationMixin],
  computed: {
    ...mapGetters('auth', [
      'organisationId', 'selectedProject', 'selectedProvider'
    ])
  },
  created () {
    debugger
  },
  mounted () {
    debugger
  },
  methods: {
    fetchRoutableIP () {
      let _this = this
      listRoutableIPByOrganisationProviderAndProject(this.organisationId, this.selectedProvider, this.selectedProject)
        .then((availableRoutableIPs) => {
          debugger
          _this.availableRoutableIPs = availableRoutableIPs
        })
    },
    requestPublicIP () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        return false
      }
      let _this = this
      store.dispatch('confirmation/showConfirmation', { title: 'Confirmation', msg: 'Are you sure you want to request for public IP?' })
        .then(() => {
          return requestIP(this.applicationName, this.applicationUrl, this.aadharCompliance, this.routableIp, this.routableIpAttachedWith)
        })
        .then(() => {
          _this.$v.$reset()
        })
        .then(() => {
          _this.$router.push({ name: 'virtual-machine-details-backup-services-list', params: { computeId: this.computeId } })
        })
    }
  }
}
</script>
