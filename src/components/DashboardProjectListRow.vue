<template>
  <li class="list-group-item"><i class="fa fa-cubes" aria-hidden="true"></i> {{ projectName }}</li>
</template>

<script>
export default {
  name: 'DashboardProjectListRow',
  props: ['project'],
  computed: {
    projectName () {
      return this.project['name']
    }
  }
}
</script>

<style scoped>
  li { cursor: pointer; }
  li:hover { background: #f0f8ff; }
</style>
