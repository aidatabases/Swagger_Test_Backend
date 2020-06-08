<template>
  <div class="form-group" :class="{ 'has-error': v.$dirty && v.$error }">
    <label class="col-md-3 control-label">User Role:</label>
    <div class="col-md-9">
      <select v-model="userRole" class="form-control" @input="v.$touch()">
        <option disabled selected value="">Please select role</option>
        <option v-for="role in userRoles" :key="role.id" :value="role.id">{{ role.group_name }}</option>
      </select>
      <span class="help-block" v-if="v.$dirty && !v.required">User Role is required</span>
    </div>
  </div>
</template>
<script >
import store from 'vuex-store'
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      default: ''
    },
    v: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('userRoles', ['userRoles']),
    userRole: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  created () {
    store.cache.dispatch('userRoles/list', {})
  }
}
</script>
