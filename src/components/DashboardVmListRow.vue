<template>
  <tr>
    <virtual-machine-list-row-vm-details :vm="vm" :p-status="status"></virtual-machine-list-row-vm-details>
    <td>
      <div class="ip-meta">
        <span class="ip-status c-gray">PRIV</span>
        <span v-if="vm.private_ip" class="snap-status c-yellow"> {{ vm.private_ip }}</span>
        <span v-else class="snap-status c-gray">Unavailable</span>
      </div>
    </td>
    <td>
      <router-link title="Security Rules" :to="{ name: 'gateway' }">Applied Rules</router-link>
    </td>
    <td>{{ isAdditionalStorageAttached }}</td>
    <!--<virtual-machine-list-row-vm-status :p-task-id="taskId" :p-status="status"></virtual-machine-list-row-vm-status>-->
    <!--<virtual-machine-list-row-actions :p-vm-id="vmId" :p-status="status"></virtual-machine-list-row-actions>-->
  </tr>
</template>

<script>
import VirtualMachineListRowVmDetails from '@/components/VirtualMachineListRowVmDetails'

export default {
  props: ['vm'],
  components: {
    virtualMachineListRowVmDetails: VirtualMachineListRowVmDetails
  },
  computed: {
    isAdditionalStorageAttached () {
      return (this.vm.volume_attach_compute.length > 0) ? 'YES' : 'NO'
    }
  }
}
</script>
