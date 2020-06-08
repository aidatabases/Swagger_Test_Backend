<template>
  <tr>
    <td>
      <div class="form-group" :class="{ 'has-error': $v.selectedUser.$dirty && $v.selectedUser.$error }">
        <select class="form-control" v-model='selectedUser'>
          <option disabled selected value=''>Select User</option>
          <option v-for="(user, index) in filteredUser" :key="index" :value="user.id">{{user.username}}</option>
        </select>
        <span v-if="$v.selectedUser.$error" class="help-block">Please select user</span>
      </div>
    </td>
    <td></td>
    <td>
      <div class="form-group" :class="{ 'has-error': $v.selectedRole.$dirty && $v.selectedRole.$error }">
        <select class="form-control" v-model='selectedRole'>
          <option disabled selected value=''>Choose Role</option>
          <option v-for="(role, index) in userRoles" :key="index" :value="role.id">{{role.group_name}}</option>
        </select>
        <span v-if="$v.selectedRole.$error" class="help-block">Please choose user's role</span>
      </div>
    </td>
    <td class="text-center">
      <button v-if="!showConfirmation" @click.prevent="showConfirmation = true" v-tooltip="'Attach user'" class="btn btn-sm btn-link"><i class="text-success fa fa-user-plus"></i></button>
      <div v-if="showConfirmation">
        Are you sure? <button class="btn btn-xs btn-success" @click.prevent="validateData()">Yes</button> <button class="btn btn-xs btn-danger" @click.prevent="showConfirmation = false">No</button>
      </div>
    </td>
  </tr>
</template>

<script>
import store from 'vuex-store'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props: {
    pProjectId: Number,
    pProjectUsers: Array
  },
  data () {
    return {
      selectedRole: '',
      selectedUser: '',
      showConfirmation: false
    }
  },
  validations: {
    selectedRole: { required },
    selectedUser: { required }
  },
  computed: {
    ...mapGetters('auth', ['selectedProject', 'selectedOrganisation']),
    ...mapGetters('userRoles', ['userRoles']),
    ...mapGetters('users', ['users']),
    filteredUser () {
      var alreadyMappedUsers = _.chain(this.pProjectUsers).map('user').map('id').value()
      var filteredUser = _.chain(this.users).filter((el) => alreadyMappedUsers.indexOf(el.id) < 0).value()
      return filteredUser
    },
    scopes () {
      return this.userRoles
        ? _.chain(this.userRoles).find({ 'id': this.selectedRole }).get('scope').value()
        : []
    }
  },
  created () {
    store.cache.dispatch('userRoles/list', {})
    store.cache.dispatch('users/LIST')
  },
  methods: {
    validateData () {
      this.showConfirmation = false
      this.$v.selectedRole.$touch()
      this.$v.selectedUser.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.attachUser()
      }
    },
    attachUser () {
      var payload = {}
      payload['user_id_list'] = []
      payload['user_id_list'].push(this.selectedUser)
      payload['organisation_id'] = this.selectedOrganisation
      payload['project_id'] = this.pProjectId
      payload['user_role'] = this.selectedRole
      store
        .dispatch('projects/attachProjectUsers', { organisationId: this.selectedOrganisation, projectId: this.pProjectId, payload })
        .then((users) => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'User attached successfully!'
          })
          this.$v.$reset()
          this.selectedUser = ''
          this.selectedRole = ''
          this.$emit('project-user-attached')
        })
    }
  },
  watch: {
    'selectedRole': function (cv, pv) {
    }
  }
}
</script>

<style scoped>
  .btn { padding: 2px 4px; margin-right: 5px; }
  td{ vertical-align: middle !important; }
</style>
