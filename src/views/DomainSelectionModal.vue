<template>
  <bootstrap-modal ref="domainSelectionModal" :needCloseButton="false" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Confirming Your Project Details</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group">
          <label class="col-sm-3 control-label">Organisation</label>
          <div class="col-sm-9">
            <select class="form-control" v-model="selectedOrganisationId">
              <option disabled value=''>Select</option>
              <option v-for="org in availableOrganisations" :key="org['id']" :value="org['id']">{{org['name'] + ' (' + org['org_reg_code'] + ')' }}</option>
            </select>
            <span class="text-muted"><em>{{ organisationDescription }}</em></span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Project</label>
          <div class="col-sm-9">
            <select class="form-control" v-model="selectedProjectId">
              <option disabled value=''>Select</option>
              <option v-for="proj in availableProjects" :key="proj['id']" :value="proj['id']">{{proj['name']}}</option>
            </select>
            <span class="text-muted"><em>{{ projectDescription }}</em></span>
          </div>
        </div>
        <div class="form-group">
          <label class="col-sm-3 control-label">Data Centre Zone</label>
          <div class="col-sm-9">
            <select class="form-control" v-model="selectedProviderId">
              <option disabled value=''>Select</option>
              <option v-for="provider in availableProviders" :key="provider['id']" :value="provider['id']">{{ provider['provider_name'] + ' - ' + provider['provider_location']}}</option>
            </select>
            <span class="text-muted"><em>{{ providerDescription }}</em></span>
          </div>
        </div>
      </form>
      <div class="row" v-if="!isSelectionAvailable">
        <small class="text-danger col-sm-12 text-center">
          {{ errorMsg }}
        </small>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-cloud" :disabled="!isSelectionAvailable" @click.prevent="domainSelectionSubmit">
        <span v-if="isSelectionAvailable">Proceed</span>
        <span v-if="!isSelectionAvailable">Please make a valid selection!</span>
      </button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import bootstrapModal from '../components/_common/Vue2BootstrapModal'

export default {
  name: 'DomainSelectionModal',
  components: {
    bootstrapModal: bootstrapModal
  },
  data () {
    return {
      availableOrganisations: {},
      availableProjects: {},
      availableProviders: {},
      selectedProjectId: null,
      selectedOrganisationId: null,
      selectedProviderId: null,
      selectedProjectDescription: null,
      selectedOrganisationDescription: null,
      selectedProviderDescription: null,
      errorMsg: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['showDomainSelectionModal', 'selectedProject', 'selectedProvider', 'selectedOrganisation', 'availableDomains', 'userScopes']),
    ...mapGetters('confirmation', ['contentId', 'msg', 'title']),
    ...mapGetters('projects', ['projectById']),
    ...mapGetters('organisations', ['organisationById']),
    ...mapGetters('providers', ['providerById']),
    selectedDomain () {
      return {
        projectId: this.selectedProjectId,
        providerId: this.selectedProviderId,
        organisationId: this.selectedOrganisationId
      }
    },
    organisationDescription () {
      if (!this.selectedOrganisationId) return ''
      const organisation = _.find(this.availableOrganisations, { 'id': this.selectedOrganisationId })
      return (organisation) ? organisation.description : ''
    },
    projectDescription () {
      if (!this.selectedProjectId) return ''
      const project = _.find(this.availableProjects, { 'id': this.selectedProjectId })
      return (project) ? project.description : ''
    },
    providerDescription () {
      if (!this.selectedProviderId) return ''
      const provider = _.find(this.availableProviders, { 'id': this.selectedProviderId })
      return (provider) ? provider['provider_description'] : ''
    },
    isSelectionAvailable () {
      return _.some(this.availableDomains, this.selectedDomain)
    },
    providedProjectId () {
      return this.userScopes.project_id
    }
  },
  methods: {
    resetFormSelections () {
      this.selectedOrganisationId = (this.selectedOrganisation) ? this.selectedOrganisation : ''
      this.selectedProjectId = (this.selectedProject) ? this.selectedProject : ''
      this.selectedProviderId = (this.selectedProvider) ? this.selectedProvider : ''
    },
    domainSelectionSubmit () {
      if (this.isSelectionAvailable) {
        this.changeProject()
      } else {
        this.showModalWithError()
      }
    },
    showModalWithError () {
      this.errorMsg = 'Your selection is not valid, Please make a valid one and then click Proceed !'
    },
    showModal () {
      this.resetFormSelections()
      this.$refs.domainSelectionModal.open()
    },
    hideModal () {
      this.$refs.domainSelectionModal.close()
    },
    changeProject () {
      store.dispatch('auth/changeProjectScope', this.selectedDomain)
        .then(() => {
          this.hideModal()
          store.cache.clear()
          store.dispatch('auth/logout', { keepSession: true, triggerLogoutEndPoint: false })
            .then(() => {
              this.$router.push({ name: 'home' })
            })
        })
    },
    proceedWithoutChange () {
      store.dispatch('auth/selectDomain', this.selectedDomain)
        .then(() => {
          this.hideModal()
        })
        .then(() => {
          this.$router.push({ name: 'home' })
        })
    },
    populateDomains () {
      this.availableDomains && this.availableDomains.forEach((el) => {
        this.organisationById(el.organisationId)
          .then((org) => {
            this.$set(this.availableOrganisations, el.organisationId, org)
          })
        this.providerById(el.providerId)
          .then((provider) => {
            this.$set(this.availableProviders, el.providerId, provider)
          })
        this.projectById(el.organisationId, el.projectId)
          .then((project) => {
            this.$set(this.availableProjects, el.projectId, project)
          })
      })
    },
    identifyCurrentProject () {
      let selectedDomain = _.find(this.availableDomains, { projectId: this.userScopes.project_id }) || {}
      this.selectedProjectId = selectedDomain['projectId']
      this.selectedProviderId = selectedDomain['providerId']
      this.selectedOrganisationId = selectedDomain['organisationId']
    },
    init () {
      this.availableOrganisations = {}
      this.availableProjects = {}
      this.availableProviders = {}
      this.populateDomains()
      this.identifyCurrentProject()
    }
  },
  created () {
    this.init()
  },
  watch: {
    'showDomainSelectionModal': function (cv, pv) {
      return this.showModal()
    },
    'userScopes': function (cv, pv) {
      this.init()
    },
    'availableDomains': function (cv, pv) {
      this.init()
    }
  }
}
</script>
