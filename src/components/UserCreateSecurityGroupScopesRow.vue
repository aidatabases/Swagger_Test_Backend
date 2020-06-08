<template>
  <tr>
    <td>{{ pHead }}</td>
    <td >
      <input @change="toggleRead" :checked="isReadSelected" :disabled="pDisabled" type="checkbox"/>
    </td>
    <td ><input @change="toggleWrite" :checked="isWriteSelected" :disabled="pDisabled" type="checkbox"/></td>
  </tr>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'UserCreateSecurityGroupScopesRow',
  props: {
    pHead: String,
    pSelectedRoleScope: Array,
    pDisabled: Boolean
  },
  methods: {
    toggleRead ($event) {
      this.$emit('scope-read-changed', { scope: this.pHead, selected: $event.target.checked })
    },
    toggleWrite ($event) {
      this.$emit('scope-write-changed', { scope: this.pHead, selected: $event.target.checked })
    }
  },
  computed: {
    isReadSelected () {
      return _.indexOf(this.pSelectedRoleScope, `${this.pHead}:read`) >= 0
    },
    isWriteSelected () {
      return _.indexOf(this.pSelectedRoleScope, `${this.pHead}:write`) >= 0
    }
  }
}
</script>
