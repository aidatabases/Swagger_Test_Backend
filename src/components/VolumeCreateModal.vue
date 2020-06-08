<template>
  <bootstrap-modal ref="volumeCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">New Volume Details</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group" :class="{ 'has-error': $v.volName.$dirty && $v.volName.$error }">
          <label class="col-lg-3 control-label">Volume Name</label>
          <div class="col-lg-9">
            <input class="form-control" placeholder="" v-model="volName" name="volName" type="text">
            <span class="help-block" v-if="$v.volName.$dirty && !$v.volName.minLength">Name must be minimum 4 character long</span>
            <span class="help-block" v-else-if="$v.volName.$dirty && !$v.volName.required">Please enter a valid volume name</span>
            <span class="help-block" v-else-if="$v.volName.$dirty && !$v.volName.name">Only alpha numeric characters and hyphen is allowed.</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error': $v.volSize.$dirty && $v.volSize.$error }">
          <label class="col-sm-3 control-label">Volume Size<br>(In <unit-filter></unit-filter>)</label>
          <div class="col-sm-9">
            <input class="form-control" placeholder="" v-model="volSize" name="volSize" type="text">
            <span class="help-block" v-if="$v.volSize.$dirty && (!$v.volSize.required || !$v.volSize.numeric || !$v.volSize.positiveNumbers || !$v.volSize.positiveNumbers || !$v.volSize.positiveNumbers || !$v.volSize.positiveNumbers)">Please enter a valid volume size</span>
            <span class="help-block" v-else-if="$v.volSize.$dirty && (!$v.volSize.minValue || !$v.volSize.maxValue)">Please enter a size between 1 to 2000 GiB</span>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="validateInputs()">Create</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required, numeric, minLength, minValue, maxValue } from 'vuelidate/lib/validators'
import { name, positiveNumbers } from '../lib/vuelidate/CustomValidations'
import filter from '../components/_common/Filter'

export default {
  mixins: [validationMixin],
  props: {
    'pShow': Number
  },
  data () {
    return {
      volName: '',
      volSize: '',
      isBootable: false
    }
  },
  validations: {
    volName: { 
      required,
      name,
      minLength: minLength(4)
    },
    volSize: {
      required,
      numeric,
      minValue: minValue(1),
      maxValue: maxValue(2000),
      positiveNumbers
    }
  },
  components: {
    bootstrapModal: bootstrapModal,
    UnitFilter: filter
  },
  computed: {
    ...mapGetters('auth', ['userId', 'organisationId']),
    ...mapGetters('auth', ['selectedProvider']),
    ...mapGetters('auth', ['selectedProject'])
  },
  methods: {
    clearForm () {
      this.volName = ''
      this.volSize = ''
      this.isBootable = false
      this.$v.$reset()
    },
    showModal () {
      this.clearForm()
      this.$refs.volumeCreateModal.open()
    },
    hideModal () {
      this.$refs.volumeCreateModal.close()
    },
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Create Volume', msg: 'Are you sure you wish to create volume?' })
        .then((cnf) => {
          this.create()
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    validateInputs () {
      this.$v.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.create()
      }
    },
    create () {
      let data = {}
      let _this = this
      data['user_id'] = this.userId
      data['volume_name'] = this['volName']
      data['volume_size'] = this['volSize']
      data['bootable'] = this['isBootable'] ? 'true' : 'false'
      data['provider_id'] = this.selectedProvider
      data['project_id'] = this.selectedProject
      store.dispatch('volumes/CREATE', { 'providerId': this.selectedProvider, 'projectId': this.selectedProject, 'payload': data })
        .then((res) => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: `New volume ${res.provider_volume_id} creation initiated`
          })
        })
        .finally(() => {
          _this.hideModal()
          _this.$router.push({ name: 'home', params: { 'destination': 'volumes' } })
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
