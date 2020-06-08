<template>
    <table style="width:100%;" cellspacing="0">
        <thead>
        <tr>
            <th>Project</th>
            <th>Organisation</th>
            <th>Description</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="project in projects" :key="project.id">
            <td>{{ project.name }}</td>
            <td>{{ project.organisation_id }}</td>
            <td>{{ project.description }}</td>
            <td> Edit | Delete</td>
        </tr>
        </tbody>
    </table>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
export default {
  name: 'RouterList',
  computed: {
    ...mapGetters('projects', ['projects'])
  },
  methods: {
    init () {
      store.cache.dispatch('projects/LIST', {})
    }
  },
  created () {
    this.init()
  }
}
</script>
