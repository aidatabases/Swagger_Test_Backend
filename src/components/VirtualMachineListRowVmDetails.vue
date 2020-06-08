<template>
  <td>
    <div class="content-box clearfix odd vm-item">
      <img :src="getOsImgUrl(vm.image.os)" alt="">
      <div class="content-info">
        <h4 @click="viewDetails">{{ vm.instance_name }}</h4>
        <div class="content-opts">
          <span>{{ vm.flavor.vcpus }} vCPU</span>
          <span><unit-filter :size="vm.flavor.ram" :unit="'GB'"></unit-filter> RAM</span>
          <span><unit-filter :size="vm.flavor.disk" :unit="'GiB'"></unit-filter> BLOCK</span>
          <v-popover>
            <span class="fa fa-info-circle"></span>
            <template slot="popover">
              <span v-if="taskId">{{ 'TASK_ID - ' + taskId }}</span>
              <span v-else>Task ID not available</span>
            </template>
          </v-popover>
        </div>
      </div>
    </div>
  </td>
</template>

<script>
import { getOsImgUrl } from '@/utils/Utils'
import filter from './_common/Filter'

export default {
  name: 'VirtualMachineListRowVmDetails',
  props: ['vm', 'pStatus'],
  components: {
    UnitFilter: filter
  },
  computed: {
    computeId () {
      return this.vm.id
    },
    taskId () {
      if (this.vm.hasOwnProperty('_meta')) {
        if (this.vm._meta['taskId'] !== '') {
          return this.vm._meta['taskId']
        }
      }
      return this.vm.task_id
    },
    status () {
      return this.pStatus
    }
  },
  methods: {
    viewDetails () {
      if (!this.taskId && this.status !== 'ERROR' && this.status !== 'processing') {
        this.$router.push({ path: `/virtual-machine/${this.computeId}/volumes` })
      } else {
        // TODO: Replace with toast message
        alert('Task is in progress.')
      }
    },
    getOsImgUrl
  }
}
</script>

<style scoped>
  .vm-item { cursor: pointer; }
  .vm-item:hover { color: #4b12ff; }
  .v-popover { display: inline-block; margin-left: 5px; }
</style>
