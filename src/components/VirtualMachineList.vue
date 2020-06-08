<template>
  <div>
    <table class="table">
    <thead>
      <tr>
        <th class="col-md-5">Name</th>
        <th class="col-md-1">PRIVATE IP</th>
        <th class="col-md-2">Security Rules</th>
        <th class="col-md-2">Additional Storage</th>
        <th class="col-md-1">Status</th>
        <th class="col-md-1">Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="virtualMachines.length > 0">
        <virtual-machine-row v-for="vm in sortedVMs"
                             :key="vm.id"
                             :vm="vm"></virtual-machine-row>
      </template>
      <template v-if="virtualMachines.length < 1">
        <tr>
          <td colspan="6">
            <h3 class="text-center" style="margin: 0; color: #90A4AE;">No virtual machine found</h3>
          </td>
        </tr>
      </template>
    </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VirtualMachineRow from '@/components/VirtualMachineListRow'
import _ from 'lodash'

export default {
  name: 'VirtualMachineListRow',
  components: {
    virtualMachineRow: VirtualMachineRow
  },
  computed: {
    ...mapGetters('virtualMachines', ['virtualMachines']),
    sortedVMs () {
      return _.orderBy(this.virtualMachines, ['id'], ['desc'])
    }
  }
}
</script>
