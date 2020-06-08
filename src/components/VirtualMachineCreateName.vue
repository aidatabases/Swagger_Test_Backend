<template>
  <div class="acc-content-row">
    <a class="acc-head" href="#opt-name" data-toggle="collapse">Virtual Machine Details</a>
    <div id="opt-name" class="collapse in">
      <div class="acc-content">
        <div class="form-group-content clearfix">
          <div class="form-group">
            <div class="row">
              <div class="col-md-6" :class="{'has-error': $v.name.$dirty && $v.name.$error, 'has-success': $v.name.$dirty && !$v.name.$error}">
                <label>
                  Virtual Machine Name <small class="text-muted"><em>(Hostname)</em></small> <sup>*</sup>
                </label>
                <div class="input-group">
                  <div class="input-group-addon">{{ vmNamePrefix }}</div>
                  <input class="form-control" type="text" v-model="name" placeholder="Enter Instance Name" @input="updateName">
                </div>
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.required">Please enter a valid name</span>
                <span class="help-block" v-else-if="$v.name.$dirty && !$v.name.minLength">The name must have at least 4 characters</span>
                <span class="help-block" v-else-if="$v.name.$dirty && !$v.name.maxLength">The name length must not exceed 16 characters</span>
                <span class="help-block" v-else-if="$v.name.$dirty && !$v.name.validName">The name must contain lower case alphabets, numbers and hyphen (-) only. It must start with an alphabet.</span>
              </div>
              <div v-if="!isWindows" class="col-md-6" :class="{'has-error': $v.osUserName.$dirty && $v.osUserName.$error, 'has-success': $v.osUserName.$dirty && !$v.osUserName.$error}">
                <label>Virtual Machine Login username</label>
                <input class="form-control" type="text" v-model="osUserName" @input="updateOsUserName" placeholder="User Name">
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.alpha">Alphabets Only !</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.required">User name is required</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.maxLength">User name should not exceed 7 characters</span>
                <span class="help-block" v-if="$v.osUserName.$dirty && !$v.osUserName.minLength">User name should be minimum 4 characters long</span>
              </div>
            </div>
          </div>
          <div v-if="!isWindows" class="form-group">
            <div class="row">
              <div class="col-md-6" :class="{'has-error': $v.password.$dirty && $v.password.$error, 'has-success': $v.password.$dirty && !$v.password.$error}">
                <label>
                  Virtual Machine Password <sup>*</sup>
                  <img class="tooltip-info" src="@/assets/images/icon-information.svg" v-tooltip.right="'15 Characters Long with atleast One lower, One Special Character, One Upper Case and One Number'">
                </label>
                <input class="form-control" @input="updatePassword" type="password" v-model="password" placeholder="Password for the instance">
                <span class="help-block" v-if="$v.password.$dirty && !$v.password.minLength">Password must be 15 characters long</span>
                <span class="help-block" v-if="$v.password.$dirty && !$v.password.required">Please enter a valid password</span>
                <span class="help-block" v-if="$v.password.$dirty && $v.password.minLength && !$v.password.validPassword">Password must contain minimum one special character, one number, one capital letter and one small letter</span>
              </div>
              <div class="col-md-6" :class="{'has-error': $v.confirmPassword.$dirty && $v.confirmPassword.$error, 'has-success': $v.confirmPassword.$dirty && !$v.confirmPassword.$error}">
                <label>Confirm Virtual Machine Password</label>
                <input class="form-control" type="password" v-model="confirmPassword" @input="updateConfirmPassword" placeholder="Confirm Password">
                <span class="help-block" v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.required">Please enter confirmation password</span>
                <span class="help-block" v-if="$v.confirmPassword.$dirty && !$v.confirmPassword.sameAsPassword">Password and confirm password are not same!</span>
            </div>
            </div>
          </div>
          <div class="form-group hidden">
            <label>Count</label>
            <input type="text" class="form-control" placeholder="20">
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
import { required, minLength, helpers, sameAs, maxLength, alpha } from 'vuelidate/lib/validators'

export default {
  name: 'VirtualMachineCreateName',
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
      'confirmPassword': ''
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
      var image = this.imageById()(this.vmImage)
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
        maxLength: maxLength(16),
        validName: (name) => {
          return helpers.regex('validInstanceName', /^(?=[a-zA-z])[a-zA-Z0-9-]*$/)(name)
        }
      },
      password: {
        required,
        minLength: minLength(15),
        validPassword: (password) => {
          return helpers.regex('validInstanceName', /^((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~!@#$%^&]).*)$/)(password)
        }
      },
      confirmPassword: {
        required,
        sameAsPassword: sameAs('password')
      },
      osUserName: {
        required,
        alpha,
        maxLength: maxLength(7),
        minLength: minLength(4)
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
        this.$emit('vm-name-changed', null)
      } else {
        this.$emit('vm-name-changed', this.vmNamePrefix + this.name)
      }
    },

    updatePassword () {
      this.$v.password.$touch()
      if (!this.$v.confirmPassword.$invalid && !this.$v.password.$invalid) {
        this.$emit('vm-password-changed', this.password)
      } else {
        this.$emit('vm-password-changed', null)
      }
    },
    updateConfirmPassword () {
      this.$v.confirmPassword.$touch()
      if (!this.$v.confirmPassword.$invalid && !this.$v.password.$invalid) {
        this.$emit('vm-password-changed', this.confirmPassword)
      } else {
        this.$emit('vm-password-changed', null)
      }
    },
    updateOsUserName () {
      this.$v.osUserName.$touch()
      if (!this.$v.osUserName.$invalid) {
        this.$emit('vm-username-changed', this.osUserName)
      } else {
        this.$emit('vm-username-changed', null)
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
