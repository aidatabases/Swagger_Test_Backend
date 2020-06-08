<template>
  <tr>
    <td>
      <span class="snap-title">
        <img src="@/assets/images/icon-project.svg" alt=""> {{ pProject.name }}
      </span>
    </td>
    <td>{{ pProject.description }}</td>
    <project-providers :p-mapped-providers="pProject.project_provider_mapping_project" :p-task-id="pProject.task_id"></project-providers>
    <td>{{ userRole(pProject.id) }}</td>
    <project-actions :p-project="pProject"></project-actions>
  </tr>
</template>

<script>
import ProjectActions from '@/components/ProjectListRowActions'
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import ProjectProviders from '@/components/ProjectListRowProviders'
import { mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'ProjectListRow',
  props: {
    index: Number,
    pProject: Object
  },
  mixins: [projectProviderMixin],
  computed: {
    ...mapGetters('auth', ['userRoles']),
    ...mapGetters('loader', ['isLoading', 'loadingMsg'])
  },
  components: {
    projectActions: ProjectActions,
    projectProviders: ProjectProviders
  },
  methods: {
    userRole (projectId) {
      if (!projectId) return
      let selectedProject = _.find(this.userRoles, { 'project_id': projectId })
      if (!selectedProject) {
        return ''
      }
      return (selectedProject.role_permission_group.group_name).replace('_', ' ')
    }
  }
}
</script>
