<template>
  <li class="list-group-item"><i class="fa fa-user-circle-o" aria-hidden="true"></i> {{ fullName }}</li>
</template>

<script>
export default {
  name: 'DashboardUserListRow',
  props: ['user'],
  computed: {
    fullName () {
      return this.user.first_name + ' ' + this.user.last_name
    }
  }
}
</script>

<style scoped>
  li { cursor: pointer; }
  li:hover { background: #f0f8ff; }
</style>
