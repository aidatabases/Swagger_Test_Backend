<template>
  <div class="row">
    <user-role-create-form v-on="listeners" class="col-lg-8"></user-role-create-form>
    <security-group-scopes v-on="listeners" class="col-lg-4"></security-group-scopes>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'
import UserRoleCreateForm from '@/components/UserRoleCreateForm'
import SecurityGroupScopes from '@/components/UserRoleCreateSecurityGroupScopes'
export default {
  name: 'UserRoleCreate',
  components: {
    userRoleCreateForm: UserRoleCreateForm,
    securityGroupScopes: SecurityGroupScopes
  },
  data () {
    return {
      name: null,
      description: null,
      scopes: []
    }
  },
  computed: {
    listeners () {
      var that = this
      return {
        ...this.$listeners,
        'user-role-create-name-changed': (name) => {
          that.name = name
        },
        'user-role-create-description-changed': (description) => {
          that.description = description
        },
        'user-role-create-scopes-changed': (scopes) => {
          that.scopes = scopes
        },
        'user-role-creation-triggered': () => {
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
      store.dispatch('confirmation/showConfirmation', { title: 'Create User Role', msg: 'Are you sure you wish to create user role? ' })
        .then((cnf) => {
          this.create()
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    create () {
      let data = {}
      data['group_name'] = this.name
      data['group_description'] = this.description
      data['organisation_id'] = this.organisationId
      data['scope'] = this.scopes
      console.log('Pre: ' + JSON.stringify(data))
      store.dispatch('userRoles/create', { payload: data })
        .then(() => {
          this.$router.push({ path: '/roles' })
        })
        .catch((error) => {
          console.log('Create Role Error: ' + JSON.stringify(error))
        })
        .finally(() => {})
    }
  }
}
</script>
