<template>
  <div class="acc-content-row">
    <a class="acc-head" href="#opt-name" data-toggle="collapse">Scaling Group Details</a>
    <div id="opt-name" class="collapse in">
      <div class="acc-content">
        <div class="form-group-content clearfix">
          <div class="form-group">
            <div class="row">
              <div class="col-md-6" :class="{'has-error': $v.name.$dirty && $v.name.$error, 'has-success': $v.name.$dirty && !$v.name.$error}">
                <label>Hostname prefix for VMs of scaling group
                  <sup>*</sup>
                  <img class="tooltip-info" src="@/assets/images/icon-information.svg" v-tooltip.right="'Hostname would be in alpha numeric series for example {hostname-prefix}-01, {hostname-prefix}-02 ... etc'"/>
                </label>
                <div class="input-group">
                  <div class="input-group-addon">{{ vmNamePrefix | uppercase }}</div>
                  <input class="form-control" type="text" v-model="name" placeholder="Enter Instance Name" @input="updateName">
                </div>
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.minLength">Atleast 4 Character Long!</span>
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.required">Name cannot be left empty!</span>
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.validName">Name must contain alphabets, numbers and hyphen (-) only. It must start with an alphabet.</span>
              </div>
              <div v-if="!isWindows" class="col-md-6" :class="{'has-error': $v.osUserName.$dirty && $v.osUserName.$error, 'has-success': $v.osUserName.$dirty && !$v.osUserName.$error}">
                <label>Username for virtual machines of scaling group</label>
                <input class="form-control" type="text" v-model="osUserName" @input="updateOsUserName" placeholder="User Name">
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.alpha">Alphabets Only !</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.required">User name is required !</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.maxLength">User name should not exceed 7 characters!</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.minLength">User name should be atleast 4 characters long!</span>
              </div>
            </div>
          </div>
          <div v-if="!isWindows" class="form-group">
            <div class="row">
              <div class="col-md-6" :class="{'has-error': $v.password.$dirty && $v.password.$error, 'has-success': $v.password.$dirty && !$v.password.$error}">
                <label>
                  Password for virtual machines of scaling group <sup>*</sup>
                  <img class="tooltip-info" src="@/assets/images/icon-information.svg" v-tooltip.right="'15 Characters Long with atleast One lower, One Special Character, One Upper Case and One Number'">
                </label>
                <input class="form-control" @input="updatePassword" type="password" v-model="password" placeholder="Password for the instance">
                <span class="help-block" v-if="$v.password.$dirty && !$v.password.minLength">Password must be atleast 15 Char Long!</span>
                <span class="help-block" v-if="$v.password.$dirty && !$v.password.required">Password is Required!</span>
                <span class="help-block" v-if="$v.password.$dirty && $v.password.minLength && !$v.password.validPassword">Password must contain minimum one special character, one number, one capital letter and one small letter</span>
              </div>
              <div class="col-md-6" :class="{'has-error': $v.confirmPassword.$dirty && $v.confirmPassword.$error, 'has-success': $v.confirmPassword.$dirty && !$v.confirmPassword.$error}">
                <label>Confirm password for virtual machines of scaling group</label>
                <input class="form-control" type="password" v-model="confirmPassword" @input="updateConfirmPassword" placeholder="Confirm Password">
                <span class="help-block" v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAsPassword">Password and confirm password are not same!</span>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-md-6" :class="{'has-error': $v.clusterSize.$dirty && $v.clusterSize.$error, 'has-success': $v.clusterSize.$dirty && !$v.clusterSize.$error}">
                <label>Scaling Group Cluster Size</label>
                <input type="text" v-model="clusterSize" @input="updateClusterSize" class="form-control" placeholder="Size of the cluster">
                <span class="help-block" v-if="$v.clusterSize.$dirty && !$v.clusterSize.required">Please enter a valid cluster size.</span>
                <span class="help-block" v-else-if="$v.clusterSize.$dirty && !$v.clusterSize.integer">Please enter a valid cluster size.</span>
                <span class="help-block" v-else-if="$v.clusterSize.$dirty && !$v.clusterSize.maxValue">Cluster size cannot be greater than 10</span>
                <span class="help-block" v-else-if="$v.clusterSize.$dirty && !$v.clusterSize.minValue">Cluster size cannot be less than 1</span>
              </div>
            </div>
          </div>
          <blockquote>
            <small class="text-danger"><em>Due to security and Privacy we are not storing any information related to your VM's Username and Password. Please make sure you have remembered the Username and Password entered above for VM access. We don't have any mechanism to retrieve these details for you.</em></small>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from 'vuex-store'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import cloudValidationMixin from '@/components/mixin/Validation'
import { required, minLength, helpers, sameAs, maxLength, alpha, integer, maxValue, minValue } from 'vuelidate/lib/validators'

export default {
  props: {
    'vmName': String,
    'vmImage': Number
  },
  mixins: [validationMixin, cloudValidationMixin],

  data: function () {
    return {
      'name': this.vmName,
      'osUserName': '',
      'password': '',
      'confirmPassword': '',
      'clusterSize': ''
    }
  },

  watch: {
    'isWindows': function (isWindows) {
      this.osUserName = ''
      this.password = ''
      this.confirmPassword = ''
    }
  },
  computed: {
    ...mapGetters('auth', ['selectedOrganisation']),
    ...mapGetters('organisations', ['selectedOrganisationHashId']),
    ...mapGetters('providers', ['selectedProviderHashId']),
    ...mapGetters('projects', ['selectedProjectHashId']),
    selectedImageOs () {
      let image = this.imageById()(this.vmImage)
      return image ? image.os : ''
    },
    isWindows () {
      return this.selectedImageOs.toLowerCase() === 'windows'
    },
    vmNamePrefix () {
      return this.selectedOrganisationHashId + '-' + this.selectedProjectHashId + '-' + this.selectedProviderHashId + '-'
    }
  },

  validations () {
    var validations = {
      name: {
        required,
        minLength: minLength(4),
        validName: (name) => {
          return helpers.regex('validInstanceName', /^(?=[a-zA-z])[a-zA-Z0-9-]*$/)(name)
        }
      },
      password: {
        required,
        minLength: minLength(15),
        validPassword: (password) => {
          return helpers.regex('validInstancePassword', /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&]).*)$/)(password)
        }
      },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      },
      osUserName: {
        required,
        alpha,
        maxLength: maxLength(7),
        minLength: minLength(4)
      },
      clusterSize: {
        required,
        integer,
        maxValue: maxValue(10),
        minValue: minValue(1)
      }
    }
    if (this.isWindows) {
      return _.pick(validations, 'name')
    }
    return validations
  },

  methods: {
    ...mapGetters('images', ['imageById']),
    init () {
      store.dispatch('flavors/list', {})
    },
    updateName () {
      this.$v.name.$touch()
      if (this.$v.name.$invalid) {
        this.$emit('sg-name-changed', null)
      } else {
        this.$emit('sg-name-changed', this.vmNamePrefix + this.name)
      }
    },
    updatePassword () {
      this.$v.password.$touch()
      if (!this.$v.confirmPassword.$invalid && !this.$v.password.$invalid) {
        this.$emit('sg-password-changed', this.password)
      } else {
        this.$emit('sg-password-changed', null)
      }
    },
    updateConfirmPassword () {
      this.$v.confirmPassword.$touch()
      if (!this.$v.confirmPassword.$invalid && !this.$v.password.$invalid) {
        this.$emit('sg-password-changed', this.confirmPassword)
      } else {
        this.$emit('sg-password-changed', null)
      }
    },
    updateOsUserName () {
      this.$v.osUserName.$touch()
      if (!this.$v.osUserName.$invalid) {
        this.$emit('sg-username-changed', this.osUserName)
      } else {
        this.$emit('sg-username-changed', null)
      }
    },
    updateClusterSize () {
      this.$v.clusterSize.$touch()
      if (!this.$v.clusterSize.$invalid) {
        this.$emit('sg-cluster-size-changed', this.clusterSize)
      } else {
        this.$emit('sg-cluster-size-changed', null)
      }
    }
  },

  created () {
    this.init()
  }
}
</script>

<style scoped>
  blockquote {
    border-left: 5px solid #e91e63;
  }
</style>
