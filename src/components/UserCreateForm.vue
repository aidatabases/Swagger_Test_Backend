<template>
  <div class="form-container">
    <h2>New User Details</h2>
    <div class="row">
      <form class="form-horizontal" @submit.prevent="create">
        <div class="form-group" :class="{ 'has-error': $v.form.firstName.$dirty && $v.form.firstName.$error }">
          <label class="col-lg-3 control-label">First Name</label>
          <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <input class="form-control" name="firstName" v-model.trim="form.firstName" type="text">
            <span class="help-block" v-if="$v.form.firstName.$dirty && !$v.form.firstName.required">First name is required</span>
            <span class="help-block" v-if="$v.form.firstName.$dirty && !$v.form.firstName.minLength">Name must have at least {{ $v.form.firstName.$params.minLength.min }} letters.</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error': $v.form.email.$dirty && $v.form.email.$error }">
          <label class="col-sm-3 control-label">Email ID</label>
          <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <input class="form-control" name="email" v-model.trim="form.email" type="email">
            <span class="help-block" v-if="$v.form.email.$dirty && !$v.form.email.required">Email is required</span>
            <span class="help-block" v-if="$v.form.email.$dirty && !$v.form.email.email">Please enter a valid email id.</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error': $v.form.mobile.$dirty && $v.form.mobile.$error }">
          <label class="col-sm-3 control-label">Mobile Number</label>
          <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <input class="form-control" name="mobile" v-model.trim="form.mobile" type="text">
            <span class="help-block" v-if="$v.form.mobile.$dirty && !$v.form.mobile.required">Mobile number is required</span>
          </div>
        </div>

        <user-create-form-role v-model="form.userRole" :v="$v.form.userRole"></user-create-form-role>
        <user-create-form-projects v-model="form.projects" :v="$v.form.projects"></user-create-form-projects>

        <div class="form-group" :class="{ 'has-error': $v.form.password.$dirty && $v.form.password.$error }">
          <label class="col-sm-3 control-label">Password</label>
          <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
            <input name="password" class="form-control" v-model.trim="form.password" type="password">
            <span class="help-block" v-if="$v.form.password.$dirty && !$v.form.password.required">Password is required</span>
          </div>
        </div>
        <div class="text-center">
          <input type="submit" @click.prevent="create" class="btn btn-cloud" value="Create User">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, email } from 'vuelidate/lib/validators'
import UserCreateFormProjects from '@/components/UserCreateFormProjects'
import UserCreateFormRole from '@/components/UserCreateFormRole'
import _ from 'lodash'
export default {
  name: 'UserCreateForm',
  components: {
    userCreateFormProjects: UserCreateFormProjects,
    userCreateFormRole: UserCreateFormRole
  },
  data () {
    return {
      form: {
        firstName: null,
        email: null,
        mobile: null,
        password: null,
        userRole: '',
        projects: null
      },
      isValidated: false
    }
  },
  mixins: [validationMixin],
  methods: {
    create () {
      this.$v.form.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      }
      this.$nextTick(() => {
        this.$emit('user-creation-triggered')
      })
    }
  },
  validations: {
    form: {
      firstName: { required, minLength: minLength(4) },
      email: { required, email },
      mobile: { required },
      password: { required },
      userRole: { required },
      projects: { required }
    }
  },
  watch: {
    'form.firstName': function (firstName) {
      this.$emit('user-create-firstname-changed', firstName)
    },
    'form.email': function (email) {
      this.$emit('user-create-email-changed', email)
    },
    'form.mobile': function (mobile) {
      this.$emit('user-create-mobile-changed', mobile)
    },
    'form.password': function (password) {
      this.$emit('user-create-password-changed', password)
    },
    'form.userRole': function (userRole) {
      this.$emit('user-create-role-changed', userRole)
    },
    'form.projects': function (projects) {
      this.$emit('user-create-projects-changed', _.map(projects, (e) => {
        return e['id'] + ''
      }))
    }
  },
  created () {
  }
}
</script>
