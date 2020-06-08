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
        <router-link title="Security Rules" :to="{ path: `/virtual-machines/${vm.id}/SecurityGroups` }">Applied Rules</router-link>
      </td>
      <td>{{ isAdditionalStorageAttached }}</td>
      <virtual-machine-list-row-vm-status :p-task-id="taskId" :p-status="status"></virtual-machine-list-row-vm-status>
      <virtual-machine-list-row-actions :task-id="taskId" :p-vm-id="vmId" :p-status="status"></virtual-machine-list-row-actions>
    </tr>
    <!--<virtual-machine-list-row-volume-details></virtual-machine-list-row-volume-details>-->
</template>

<script>
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import VirtualMachineListRowVmDetails from '@/components/VirtualMachineListRowVmDetails'
import VirtualMachineListRowVmStatus from '@/components/VirtualMachineListRowVmStatus'
import VirtualMachineListRowActions from '@/components/VirtualMachineListRowActions'
// import VirtualMachineListRowVolumeDetails from '@/components/VirtualMachineListRowVolumeDetails'

export default {
  name: 'VirtualMachineListRow',
  props: ['vm'],
  mixins: [projectProviderMixin],
  components: {
    virtualMachineListRowVmDetails: VirtualMachineListRowVmDetails,
    virtualMachineListRowVmStatus: VirtualMachineListRowVmStatus,
    virtualMachineListRowActions: VirtualMachineListRowActions
    // virtualMachineListRowVolumeDetails: VirtualMachineListRowVolumeDetails
  },
  computed: {
    appliedSecurityGroupId () {
      return this.vm.security_group.id
    },
    isAdditionalStorageAttached () {
      return (this.vm.volume_attach_compute.length > 0) ? 'YES' : 'NO'
    },
    vmId () {
      return this.vm.id
    },
    taskId () {
      return this.vm.task_id
    },
    status () {
      return (this.vm.hasOwnProperty('_meta')) ? this.vm._meta['status'] : ''
    }
  }
}
</script>
