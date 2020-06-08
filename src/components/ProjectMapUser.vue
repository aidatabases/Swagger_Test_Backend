<template>
  <bootstrap-modal ref="projectUserMapModal" :need-header="true" :need-footer="false" :size="'large'">
    <div slot="title">
      <h4 class="modal-title">Map User</h4>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-md-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <th class="col-md-3">User Name</th>
                <th class="col-md-3">Email</th>
                <th class="col-md-3">Assigned Role</th>
                <th class="col-md-3 text-center" v-if="canWriteUsers">Action</th>
              </tr>
            </thead>
            <tbody>
              <user-row @project-user-detached="reloadUser" v-for="(u, index) in projectUsers"
                        :key="index"
                        :p-project-id="projectId"
                        :p-user="u.user"
                        :p-user-role="u.role_permission_group.group_name" :p-can-write-users="canWriteUsers"></user-row>
              <user-attach-form v-if="canWriteUsers" :p-project-id="projectId" @project-user-attached="reloadUser" :p-project-users="projectUsers" ></user-attach-form>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import Multiselect from 'vue-multiselect'
import ProjectMapUserRow from '@/components/ProjectMapUserRow'
import ProjectMapUserAddRow from '@/components/ProjectMapUserAddRow'
import * as acl from '@/utils/Acls'

export default {
  components: {
    bootstrapModal: bootstrapModal,
    multiselect: Multiselect,
    userRow: ProjectMapUserRow,
    userAttachForm: ProjectMapUserAddRow
  },
  data () {
    return {
      projectId: -1,
      projectUsers: [],
      providerId: '',
      userSelected: [],
      userRole: '',
      userScope: [],
      projectName: ''
    }
  },
  computed: {
    ...acl,
    ...mapGetters('providers', ['providers']),
    ...mapGetters('projects', ['projectById']),
    ...mapGetters('auth', ['selectedProject', 'selectedOrganisation']),
    ...mapGetters('ui', ['showProjectUserMapModal']),
    ...mapGetters('users', ['users'])
  },
  methods: {
    init () {
      this.$store.dispatch('users/LIST')
      this.projectId = this.showProjectUserMapModal['projectId']
      this.reloadUser()
    },
    showModal () {
      this.$refs.projectUserMapModal.open()
    },
    hideModal () {
      this.$refs.projectUserMapModal.close()
    },
    reloadUser () {
      store
        .dispatch('projects/listProjectUsers', { organisationId: this.selectedOrganisation, projectId: this.projectId })
        .then((users) => {
          this.projectUsers = users
        })
    },
    mapUser () {
      this.hideModal()
      let data = {}
      data['organisation_id'] = this.project.organisation_id
      data['project_id'] = this.projectId
      data['user_id_list'] = Object.keys(this.userSelected)
      data['user_role'] = this.userRole
      data['user_scope'] = this.userScope

      store.dispatch('', data)
        .then(() => {
          // this.$router.push({ path: '/projects' })
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'New volume created successfully!'
          })
        })
        .catch(error => {
          console.log(error)
          this.$notify({
            group: 'error',
            title: 'Error',
            type: 'error',
            duration: 8000,
            text: 'An error occurred while creating volume!'
          })
        })
        .finally(() => {})
    }
  },
  created () {
    this.init()
  },
  watch: {
    'showProjectUserMapModal.cb': function (cv, pv) {
      this.init()
      var that = this
      this.$nextTick(() => {
        that.showModal()
      })
    },
    'projectId': function (cv, pv) {
      this.projectById(this.selectedOrganisation, this.selectedProject)
        .then((project) => {
          this.projectName = project['name']
        })
    }
  }
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
  /*.multiselect__tags-wrap{ display: inline-block; padding: 2px 10px; background: #2948b0; color: #ffffff;}*/
  .multiselect__tags-wrap > span {
    background-color: #eeeeee;
    border-radius: 3px;
    /*display: inline-block;*/
    padding: 2px 5px;
    margin: 0 5px 0 0;
    border: 1px solid #cccccc;
  }
  .multiselect__tags-wrap .remove-btn { cursor: pointer; }
  .multiselect__option--highlight { background: #5897fb !important; }
</style>
