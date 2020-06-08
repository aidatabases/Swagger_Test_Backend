<template>
  <bootstrap-modal ref="projectModal" :need-header="true" :need-footer="true" :size="'large'">
    <div slot="title">
      <h4 class="modal-title">Create Project</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <fieldset>
          <legend>Basic Details</legend>
          <div class="form-group" :class="{ 'has-error': $v.formData.projectName.$dirty && $v.formData.projectName.$error }">
            <label class="col-sm-4 control-label">Project Name<sup>*</sup></label>
            <div class="col-sm-8">
              <input type="text" class="form-control" v-model="formData.projectName">
              <span class="help-block" v-if="$v.formData.projectName.$error && !$v.formData.projectName.required">Project name is required</span>
              <span class="help-block" v-if="$v.formData.projectName.$error && $v.formData.projectName.required && !$v.formData.projectName.minLenght">Minimum 4 characters required</span>
            </div>
          </div>
          <div class="form-group" :class="{ 'has-error': $v.formData.projectDesc.$dirty && $v.formData.projectDesc.$error }">
            <label class="col-md-4 control-label">Project Description<sup>*</sup></label>
            <div class="col-sm-8">
              <textarea class="form-control" rows="5" v-model="formData.projectDesc"></textarea>
              <span class="help-block" v-if="$v.formData.projectDesc.$error && !$v.formData.projectDesc.required">Project description is required</span>
            </div>
          </div>
        </fieldset>
        <br>
        <fieldset>
          <legend>Technical Details</legend>
          <div class="form-group" :class="{ 'has-error': $v.formData.technologyUsed.$dirty && $v.formData.technologyUsed.$error }">
            <label class="col-sm-4 control-label">Project Stack Technology<sup>*</sup></label>
            <div class="col-sm-8">
              <multiselect v-model="formData.technologyUsed" :options="formOptions['stackTechnologies']" :multiple="true" :close-on-select="false" :clear-on-select="false" :preserve-search="true" placeholder="Select" label="label" track-by="label" :preselect-first="false" :taggable="true"></multiselect>
              <span class="help-block" v-if="$v.formData.technologyUsed.$error && !$v.formData.technologyUsed.required">Please select technologies</span>
            </div>
          </div>
          <div class="form-group" :class="{ 'has-error': $v.formData.environment.$dirty && $v.formData.environment.$error }">
            <label class="col-sm-4 control-label">Project Environment<sup>*</sup></label>
            <div class="col-sm-8">
              <select v-model="formData.environment" class="form-control">
                <option value="">Select</option>
                <option v-for="(e, index) in formOptions['environments']" :key="index" :value="e.value">{{ e.label }}</option>
              </select>
              <span class="help-block" v-if="$v.formData.environment.$error && !$v.formData.environment.required">Please select environment</span>
            </div>
          </div>
          <div class="form-group" :class="{ 'has-error': $v.formData.database.$dirty && $v.formData.database.$error }">
            <label class="col-sm-4 control-label">Database<sup>*</sup></label>
            <div class="col-sm-8">
              <select v-model="formData.database" class="form-control">
                <option value="">Select</option>
                <option v-for="(db, index) in formOptions['databases']" :key="index" :value="db.value">{{ db.label }}</option>
              </select>
              <span class="help-block" v-if="$v.formData.database.$error && !$v.formData.database.required">Please select database type</span>
            </div>
          </div>
          <div class="form-group" :class="{ 'has-error': $v.formData.deploymentEnvironment.$dirty && $v.formData.deploymentEnvironment.$error }">
            <label class="col-sm-4 control-label">Deployment Environment<sup>*</sup></label>
            <div class="col-sm-8">
              <select v-model="formData.deploymentEnvironment" class="form-control">
                <option value="">Select</option>
                <option v-for="(env, index) in formOptions['deploymentEnvironment']" :key="index" :value="env.value">{{ env.label }}</option>
              </select>
              <span class="help-block" v-if="$v.formData.deploymentEnvironment.$error && !$v.formData.deploymentEnvironment.required">Please select Deployment Environment</span>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <div slot="footer">
      <div v-if="showConfirmationButton">
        Are you sure?
        <button type="submit" class="btn btn-danger" @click.prevent="create()">Yes</button>
        <button type="submit" class="btn btn-default" @click.prevent="showConfirmationButton=false">No</button>
      </div>
      <div v-else>
        <button type="button" class="btn btn-primary" @click="showConfirmationButton=true">Create</button>
        <button type="button" class="btn btn-default" @click="hideModal">Close</button>
      </div>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
import Multiselect from 'vue-multiselect'

export default {
  name: 'ProjectCreate',
  components: {
    bootstrapModal, Multiselect
  },
  props: {
    'pShow': Number
  },
  mixins: [validationMixin],
  data () {
    return {
      showConfirmationButton: false,
      formData: {
        projectName: '',
        projectDesc: '',
        technologyUsed: '',
        environment: '',
        database: '',
        deploymentEnvironment: ''
      },
      formOptions: {
        stackTechnologies: [
          { label: 'PHP', value: 'PHP' },
          { label: 'Java', value: 'Java' },
          { label: 'Scala', value: 'Scala' }
        ],
        environments: [
          { label: 'PHP', value: 'PHP' },
          { label: 'Java', value: 'Java' },
          { label: 'Scala', value: 'Scala' }
        ],
        databases: [
          { label: 'MySQL', value: 'MySQL' },
          { label: 'MongoDB', value: 'MongoDB' },
          { label: 'Oracle', value: 'Oracle' },
          { label: 'SQL Server', value: 'SQL Server' },
          { label: 'PostgreSQL', value: 'PostgreSQL' }
        ],
        deploymentEnvironment: [
          { label: 'CentOS 7', value: 'centos-7' },
          { label: 'Ubuntu 18', value: 'ubuntu-18' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters('auth', ['organisationId']),
    ...mapGetters('providers', ['getSelectedProviderId'])
  },
  methods: {
    showModal () {
      this.$refs.projectModal.open()
    },
    hideModal () {
      this.$refs.projectModal.close()
      this.clearForm()
    },
    create () {
      let _this = this
      this.$v.formData.$touch()
      // this.$v.formData.projectName.$touch()
      // this.$v.formData.projectDesc.$touch()

      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      }

      let metaData = []
      _this.formData['technologyUsed'].forEach((v) => {
        metaData.push('stack_technologies:' + v.value)
      })
      metaData.push('environment:' + this.formData['environment'])
      metaData.push('database:' + this.formData['database'])
      metaData.push('deployment_environment:' + this.formData['deploymentEnvironment'])

      let data = {}
      data['name'] = this['formData']['projectName']
      data['description'] = this['formData']['projectDesc']
      data['organisation_id'] = this.organisationId
      data['project_meta'] = metaData

      store.dispatch('projects/CREATE', data)
        .then(() => {
          this.$router.push({ path: '/projects' })
          console.log('Provider created')
        }).catch(({ error }) => {
          console.log(error)
        }).finally(() => {
          this.hideModal()
          this.clearForm()
        })
    },
    clearForm () {
      this.formData['projectName'] = ''
      this.formData['projectDesc'] = ''
      this.formData['technologyUsed'] = ''
      this.formData['environment'] = ''
      this.formData['database'] = ''
      this.formData['deploymentEnvironment'] = ''
      this.showConfirmationButton = false
      this.$v.formData.$reset()
    }
  },
  validations: {
    formData: {
      projectName: { required, minLength: minLength(4) },
      projectDesc: { required },
      technologyUsed: { required },
      environment: { required },
      database: { required },
      deploymentEnvironment: { required }
    }
  },
  watch: {
    'pShow': function (cv, pv) {
      var that = this
      this.$nextTick(() => {
        that.showModal()
      })
    }
  }
}
</script>

<style scoped>
  form { padding: 10px 40px; }
</style>
