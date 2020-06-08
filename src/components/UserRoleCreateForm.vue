<template>
  <div class="row">
    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
      <div class="form-container">
        <div class="form-row">
          <h2>New Role Details</h2>
          <form class="form-horizontal" @submit.prevent="create">
            <div class="form-group" :class="{ 'has-error': $v.name.$dirty && $v.name.$error }">
              <label class="col-lg-3 control-label">Role</label>
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                <input class="form-control" placeholder="" name="name" v-model.trim="name" type="text">
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.required">Please enter a role name.</span>
                <span class="help-block" v-if="$v.name.$dirty && !$v.name.name">Please enter a valid role name. Only alphabets, numbers and hyphen is allowed. </span>
              </div>
            </div>
            <div class="form-group" :class="{ 'has-error': $v.description.$dirty && $v.description.$error }">
              <label class="col-sm-3 control-label">Description</label>
              <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
                <input class="form-control" placeholder="" name="description" v-model.trim="description" type="text">
                <span class="help-block" v-if="$v.description.$dirty && !$v.description.required">Please enter role description</span>
              </div>
            </div>
            <div class="text-center">
              <input type="submit" @click.prevent="create" class="btn btn-cloud" value="Create Role">
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { name } from '../lib/vuelidate/CustomValidations'

export default {
  name: 'UserRoleCreateForm',
  mixins: [validationMixin],
  data () {
    return {
      name: null,
      description: null
    }
  },
  validations: {
    name: { required, name },
    description: { required }
  },
  methods: {
    create () {
      this.$v.$touch()

      if (!this.$v.$anyError) {
        this.$v.$reset()
        this.$nextTick(() => {
          this.$emit('user-role-creation-triggered')
        })
      }
    }
  },
  watch: {
    'name': function (name) {
      this.$emit('user-role-create-name-changed', name)
    },
    'description': function (description) {
      this.$emit('user-role-create-description-changed', description)
    }
  }
}
</script>
