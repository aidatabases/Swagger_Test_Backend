<template>
  <bootstrap-modal ref="projectProviderMapModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Map Provider</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label class="control-label">Provider:</label>
        <select class="form-control" v-model="providerId">
          <option value="">Select</option>
          <option v-for="p in availableProvidersList()" :key="p.provider.id" :value="p.provider.id">{{ p.provider.provider_name }} - {{p.provider.provider_location}}</option>
        </select>
      </div>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="mapProvider">Assign</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import _ from 'lodash'

export default {
  name: 'ProjectMapProvider',
  components: {
    bootstrapModal: bootstrapModal
  },
  data () {
    return {
      projectId: -1,
      providerId: '',
      project: null
    }
  },
  computed: {
    ...mapGetters('auth', ['organisationId']),
    ...mapGetters('providers', ['availableProviders']),
    ...mapGetters('organisations', ['getSelectedOrganisationId']),
    ...mapGetters('projects', ['projectById']),
    ...mapGetters('ui', ['showProjectProviderMapModal'])
  },
  methods: {
    showModal () {
      this.$refs.projectProviderMapModal.open()
    },
    hideModal () {
      this.$refs.projectProviderMapModal.close()
    },
    mapProvider () {
      let _this = this
      let data = {}
      data['organisation_id'] = this.getSelectedOrganisationId
      data['provider_id'] = this.providerId
      data['project_id'] = this.projectId

      store.dispatch('projects/MAP_PROVIDER', data)
        .then(() => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'Project mapping initiated!'
          })
        })
        .catch(error => {
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 10000,
            text: error
          })
        })
        .finally(() => {
          this.hideModal()
          // this.$router.push({ path: '/projects' })
          _this.$router.push({ name: 'home', params: { 'destination': 'projects' } })
        })
    },
    init () {
      store.cache.dispatch('providers/listAvailableProviders', { organisation_id: this.getSelectedOrganisationId })
    },
    availableProvidersList () {
      if (this.project && this.project.project_provider_mapping_project.length > 0) {
        let mappedProvider = _.chain(this.project.project_provider_mapping_project)
          .map('provider_id').value()
        let availableProvidersList = this.availableProviders.filter((p) => {
          return mappedProvider.indexOf(p.provider.id) < 0
        })
        return availableProvidersList
      } else {
        return this.availableProviders
      }
    }
  },
  created () {
    this.init()
  },
  watch: {
    'showProjectProviderMapModal.cb': function (cv, pv) {
      let _this = this
      this.projectId = this.showProjectProviderMapModal['projectId']
      this.projectById(this.organisationId, this.projectId)
        .then((project) => {
          _this.project = project
          _this.showModal()
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
