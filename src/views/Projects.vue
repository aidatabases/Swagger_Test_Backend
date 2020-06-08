<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container">
        <div class="snap-table-head clearfix">
          <h1>My Projects</h1>
          <button v-if="isAdmin" type="button" class="btn btn-cloud" @click.prevent="showModal()">New Project</button>
        </div>
        <project-list></project-list>
      </div>
    </div>
    <project-create :p-show="showProjectCreateModal"></project-create>
    <project-map-provider :p-show="showProviderMapModal"></project-map-provider>
    <project-map-user :p-show="showUserMapModal"></project-map-user>
  </div>
</template>

<script>
import ProjectList from '@/components/ProjectList'
import ProjectCreate from '@/components/ProjectCreate'
import ProjectMapProvider from '@/components/ProjectMapProvider'
import ProjectMapUser from '@/components/ProjectMapUser'
import { mapGetters } from 'vuex'

export default {
  name: 'Projects',
  components: {
    projectList: ProjectList,
    projectCreate: ProjectCreate,
    projectMapProvider: ProjectMapProvider,
    projectMapUser: ProjectMapUser
  },
  computed: {
    ...mapGetters('auth', ['user']),
    isAdmin () {
      return !!this.user['is_admin']
    }
  },
  methods: {
    showModal () {
      this.showProjectCreateModal = Math.floor(Math.random() * Math.floor(100))
    }
  },
  data () {
    return {
      showProjectCreateModal: -1,
      showProviderMapModal: -1,
      showUserMapModal: -1
    }
  }
}
</script>
