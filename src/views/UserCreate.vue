<template>
  <div class="row">
    <div class="col-lg-8 col-md-8 col-sm-12 col-xs-12">
      <user-create-form v-on="listeners"></user-create-form>
    </div>
    <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
      <security-group-scopes :p-role-id="roleId"></security-group-scopes>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'
import UserCreateForm from '@/components/UserCreateForm'
import SecurityGroupScopes from '@/components/UserCreateSecurityGroupScopes'
export default {
  name: 'UserCreate',
  components: {
    userCreateForm: UserCreateForm,
    securityGroupScopes: SecurityGroupScopes
  },
  data () {
    return {
      firstName: null,
      email: null,
      roleId: null,
      mobile: null,
      projects: [],
      password: null,
      recaptcha: 'secret_key'
    }
  },
  computed: {
    listeners () {
      var that = this
      return {
        ...this.$listeners,
        'user-create-role-changed': (role) => {
          that.roleId = role
        },
        'user-create-projects-changed': (projects) => {
          that.projects = projects
        },
        'user-create-firstname-changed': (firstname) => {
          that.firstName = firstname
        },
        'user-create-email-changed': (email) => {
          that.email = email
        },
        'user-create-mobile-changed': (mobile) => {
          that.mobile = mobile
        },
        'user-create-password-changed': (password) => {
          that.password = password
        },
        'user-creation-triggered': () => {
          that.showConfirmation()
        }
      }
    },
    ...mapGetters('auth', [
      'organisationId'
    ])
  },
  methods: {
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Create User', msg: 'Are you sure You wish to create User? ' })
        .then((cnf) => {
          this.create()
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    create () {
      let data = {}
      data['first_name'] = this.firstName
      data['email'] = this.email
      data['user_role'] = this.roleId
      data['password'] = this.password
      data['mobile_no'] = this.mobile
      data['project_id'] = this.projects
      data['recaptcha_key'] = this.recaptcha
      data['organisation_id'] = this.organisationId

      store.dispatch('users/CREATE', { payload: data, organisationId: this.organisationId })
        .then(() => {
          this.$router.push({ path: '/users' })
        })
        .catch((error) => {
          console.log('Create User Error: ' + JSON.stringify(error))
        })
        .finally(() => {})
    }
  }
}
</script>
