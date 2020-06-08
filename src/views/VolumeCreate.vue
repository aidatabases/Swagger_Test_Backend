<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-container">
        <div class="form-row">
          <h2>New Volume details</h2>
            <form class="form-horizontal" @submit.prevent="validateInputs()">
              <div class="form-group" :class="{ 'has-error': $v.volName.$dirty && $v.volName.$error }">
                <label class="col-lg-3 control-label">Volume Name</label>
                <div class="col-lg-9">
                  <input class="form-control" placeholder="" v-model="volName" name="volName" type="text">
                  <span class="help-block" v-if="$v.volName.$dirty && !$v.volName.required">Volume name is required</span>
                  <span class="help-block" v-if="$v.volName.$dirty && !$v.volName.alphaNum">Only alpha numeric characters are allowed</span>
                  <span class="help-block" v-if="$v.volName.$dirty && !$v.volName.minLength">Name must be minimum 4 characters long</span>
                </div>
              </div>
              <div class="form-group" :class="{ 'has-error': $v.volSize.$dirty && $v.volSize.$error }">
                <label class="col-sm-3 control-label">Volume Size (In <unit-filter></unit-filter>)</label>
                <div class="col-sm-9">
                  <input class="form-control" placeholder="" v-model="volSize" name="volSize" type="text">
                  <span class="help-block" v-if="$v.volSize.$dirty && !$v.volSize.required">Volume size is required</span>
                  <span class="help-block" v-if="$v.volSize.$dirty && !$v.volSize.numeric">Enter a valid volume size</span>
                </div>
              </div>
              <div class="text-center">
                <input type="submit" class="btn btn-cloud" value="Create Volume">
              </div>
            </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { createVolume } from '@/utils/VolumesUtil'
import { required, alphaNum, minLength, numeric } from 'vuelidate/lib/validators'
import filter from '../components/_common/Filter'

export default {
  mixins: [validationMixin],
  data () {
    return {
      volName: '',
      volSize: '',
      isBootable: false
    }
  },
  validations: {
    volName: { required, alphaNum, minLength: minLength(4) },
    volSize: { required, numeric }
  },
  components: {
    UnitFilter: filter
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
    ])
  },
  methods: {
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
      this.$v.volName.$touch()
      this.$v.volSize.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.showConfirmation()
      }
    },
    create () {
      let data = {}
      data['user_id'] = this.userId
      data['volume_name'] = this['volName']
      data['volume_size'] = this['volSize']
      data['bootable'] = this['isBootable'] ? 'true' : 'false'
      data['provider_id'] = this.selectedProvider
      data['project_id'] = this.selectedProject
      createVolume(data)
        .then(() => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'New volume creation initiated.'
          })
        })
        .catch(() => {
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 10000,
            text: 'An error occurred while creating volume!'
          })
        })
        .finally(() => {
          store.dispatch('confirmation/hideConfirmation')
        })
    }
  }
}
</script>
