<template>
  <table style="width:100%;" cellspacing="0">
    <thead>
      <tr>
        <th>Project</th>
        <th>Description</th>
        <th>Data Centre Zone</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <project-list-row v-for="(project, index) in sortedProjects" :index="index" :key="project.id" :p-project="project"></project-list-row>
    </tbody>
  </table>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import ProjectListRow from '@/components/ProjectListRow'
import _ from 'lodash'
export default {
  name: 'ProjectList',
  components: {
    projectListRow: ProjectListRow
  },
  computed: {
    ...mapGetters('projects', ['projects']),
    sortedProjects () {
      return _.orderBy(this.projects, ['id'], ['desc'])
    }
  },
  methods: {
    init () {
      let _this = this
      store.cache.dispatch('projects/LIST', {})
        .then((res) => {
          _.chain(res).filter((v) => !!v.task_id).map('task_id')
            .forEach((taskId) => {
              _this.$socket.emit('join_room', { 'taskId': taskId })
              _this.$socket.on(taskId, ({ data }) => {
                if (data['status_code']) {
                  store.cache.delete('projects/LIST', {})
                  _this.init()
                  // Show notification if error occured
                  if (data['status_code'] !== 201 && data['data']) {
                    _this.$notify({
                      group: 'error',
                      type: 'error',
                      title: 'Error',
                      text: data['data'],
                      duration: 10000
                    })
                  }
                }
              })
              _this.$options.beforeDestroy.push(() => {
                _this.$socket.off(taskId)
              })
            }).value()
        })
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    store.cache.delete('projects/LIST', {})
  }
}
</script>
