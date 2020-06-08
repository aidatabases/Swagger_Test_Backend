<template>
  <div class="form-group" :class="{ 'has-error': v.$dirty && v.$error }">
    <label class="col-md-3 control-label">User Projects:</label>
    <div class="col-md-9">
      <multiselect v-model="selectedProjects"
                   :options="validProjects(projects)"
                   :multiple="true"
                   label="name"
                   track-by="id"
                   selectLabel="Select"
                   deselectLabel="Remove"
                   :preselect-first="false" @input="v.$touch()">
      </multiselect>
      <span class="help-block" v-if="v.$dirty && !v.required">User Project is required</span>
    </div>
  </div>
</template>
<script >
import store from 'vuex-store'
import Multiselect from 'vue-multiselect'
import { mapGetters } from 'vuex'

export default {
  props: {
    value: {
      default: []
    },
    v: {
      type: Object,
      required: true
    }
  },
  components: {
    multiselect: Multiselect
  },
  created () {
    store.cache.dispatch('projects/LIST', {})
  },
  computed: {
    ...mapGetters('projects', ['projects']),
    ...mapGetters('auth', ['availableDomains']),
    selectedProjects: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods: {
    validProjects (projects) {
      return projects.filter(project => project.project_provider_mapping_project.length > 0)
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  .multiselect__tag {
    background: #ff9600 !important;
  }
  .multiselect__option--highlight {
    background: #ff9600 !important;
  }
  .has-error .multiselect__tags {
    border-color: #a94442 !important;
  }
</style>
