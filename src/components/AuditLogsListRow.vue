<template>
  <tr>
    <td>{{index + 1 }}</td>
    <td>{{ pLog.created | timestamp-to-readable}}</td>
    <td>{{ pLog.ip_address }}</td>
    <td>{{ pLog.message }}</td>
    <td>{{ pLog.action_type }}</td>
  </tr>
</template>

<script>
export default {
  props: ['pLog', 'index']
}
</script>
