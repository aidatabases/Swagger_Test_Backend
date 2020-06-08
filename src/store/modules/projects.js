import store from 'vuex-store'
import _ from 'lodash'
import ProjectsApi from '@/api/Projects'

export default {
  namespaced: true,

  state: {
    projects: []
  },

  mutations: {
    SET_PROJECTS (state, payload) {
      state.projects = payload
    },
    SELECT_PROJECT (state, payload) {
      state.selectedProject = payload
    },
    RESET (state) {
      state.projects = []
    },
    SET_PROJECT (state, project) {
      state.projects = _.chain(state.projects).filter((_el) => _el.id !== project.id).push(project).value()
    }
  },

  actions: {
    LIST (context, { organisationId }) {
      if (!organisationId) {
        organisationId = context.rootGetters['auth/selectedOrganisation']
      }
      return ProjectsApi.listProjects(organisationId)
        .then(projects => {
          context.commit('SET_PROJECTS', projects)
          return projects
        })
        .catch(error => console.log(error))
        .finally(() => {})
    },

    details (context, { organisationId, projectId }) {
      if (!organisationId) {
        organisationId = context.rootGetters['auth/selectedOrganisation']
      }
      context.dispatch('loader/addMessage', { type: 'project-details', msg: `Fetching project Details` }, { root: true })
      return ProjectsApi.getProject(organisationId, projectId)
        .then(project => {
          context.commit('SET_PROJECT', project)
          return project
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'project-details' }, { root: true })
        })
    },

    listProjectUsers (context, { organisationId, projectId }) {
      context.dispatch('loader/addMessage', { type: 'project-user-list', msg: 'Fetching project Users !' }, { root: true })
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      return ProjectsApi.listProjectUsers(organisationId, projectId)
        .then(projectUsers => {
          return projectUsers
        })
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'project-user-list' }, { root: true })
        })
    },

    detachProjectUsers (context, { organisationId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'project-user-detach', msg: 'Detaching User from Project !' }, { root: true })
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      return ProjectsApi.detachProjectUser(organisationId, projectId, payload)
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'project-user-detach' }, { root: true })
        })
    },

    attachProjectUsers (context, { organisationId, projectId, payload }) {
      context.dispatch('loader/addMessage', { type: 'project-user-attach', msg: 'Attaching User to Project !' }, { root: true })
      if (!projectId) {
        projectId = context.rootGetters['auth/selectedProject']
      }
      return ProjectsApi.attachProjectUser(organisationId, projectId, payload)
        .finally(() => {
          context.dispatch('loader/removeMessage', { type: 'project-user-attach' }, { root: true })
        })
    },

    CREATE (context, payload) {
      context.dispatch('loader/addMessage', { type: 'project-create', msg: 'Creating Project !' }, { root: true })
      return ProjectsApi.createProject(payload.organisation_id, payload)
        .then(project => {
          return project
        })
        .finally(() => {
          store.cache.delete('projects/LIST', {})
          store.cache.dispatch('projects/LIST', {})
          context.dispatch('loader/removeMessage', { type: 'project-create' }, { root: true })
        })
    },

    MAP_PROVIDER (context, payload) {
      context.dispatch('loader/addMessage', { type: 'project-init-provider', msg: 'Initializing Project On Provider!' }, { root: true })
      return ProjectsApi.initProvider(payload.organisation_id, payload.provider_id, payload.project_id, payload)
        .then(resp => {
          return resp
        })
        .finally(() => {
          store.cache.delete('projects/LIST', {})
          store.cache.dispatch('projects/LIST', {})
          context.dispatch('loader/removeMessage', { type: 'project-init-provider' }, { root: true })
        })
    }
  },

  getters: {
    getSelectedProjectName (state, getters) {
      if (getters.getSelectedProject) {
        return getters.getSelectedProject['name']
      }
      return ''
    },

    getSelectedProject (state, getters, rootState, rootGetters) {
      return getters.projectById(rootGetters['auth/selectedProject'])
    },

    projects (state) {
      return state.projects
    },

    projectById (state) {
      return (organisationId, projectId) => {
        if (!projectId) {
          return Promise.reject(new Error('No project Id Provided'))
        }
        if (_.some(state.projects, { id: projectId })) {
          return Promise.resolve(_.find(state.projects, { id: projectId }))
        } else {
          // trigger update and cache the result
          return store.cache.dispatch('projects/details', { 'organisationId': organisationId, 'projectId': projectId })
        }
      }
    },

    getSelectedProjectId (state, getters, rootState, rootGetters) {
      return rootGetters['auth/selectedProject']
    },

    selectedProjectHashId (state, getters) {
      let projectId = getters.getSelectedProjectId
      if (_.some(state.projects, { id: projectId })) {
        let provider = _.find(state.projects, { id: projectId })
        return provider.project_id
      } else {
        return ''
      }
    }
  }
}
