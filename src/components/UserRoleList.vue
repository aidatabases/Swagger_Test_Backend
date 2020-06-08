<template>
  <!--<pre>{{ roles }}</pre>-->
  <table style="width:100%;" cellspacing="0">
    <thead>
    <tr>
      <th>Role Name</th>
      <th>Scope</th>
      <th>Description</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="role in roles" :key="role.id">
      <td>{{ role.group_name }}</td>
      <td>
        <span v-for="scope in role.scope" :key="scope">{{ scope }}</span>
      </td>
      <td>{{ role.group_description }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ['roles']
}
</script>

<style scoped>
  span { display: inline-block; margin-right: 10px; }
</style>
