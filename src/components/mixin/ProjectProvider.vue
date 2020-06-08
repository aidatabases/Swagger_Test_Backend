<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ProjectProvider',
  computed: {
    ...mapGetters('auth', [
      'selectedProject',
      'selectedProvider',
      'selectedOrganisation'
    ]),
    ...mapGetters('projects', [
      'projectById'
    ]),
    ...mapGetters('providers', [
      'providerById'
    ]),
    ...mapGetters('organisations', [
      'organisationById'
    ])
  },
  data () {
    return {
      projectName: null,
      providerName: null,
      providerLocation: null,
      organisationName: null
    }
  },
  created () {
    this.projectById(this.selectedOrganisation, this.selectedProject)
      .then((project) => {
        this.projectName = project['name']
      })
    this.providerById(this.selectedProvider)
      .then((provider) => {
        this.providerName = provider['provider_name']
        this.providerLocation = provider['provider_location']
      })

    this.organisationById(this.selectedOrganisation)
      .then((organisation) => {
        this.organisationName = organisation['name']
      })
  },
  watch: {
    'selectedProject': function () {
      this.projectById(this.selectedOrganisation, this.selectedProject)
        .then((project) => {
          this.projectName = project['name']
        })
    }
  }
}
</script>
