<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div class="snap-table-head clearfix">
        <h4>Backup Services
        <small style="float: right;"><router-link :to="{ name: 'virtual-machine-details-backup-create'}" tag="button" class="btn btn-cloud">create new</router-link></small>
        </h4>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import { getBackupIP } from '@/utils/BackupUtil'
export default {
  name: 'VirtualMachineDetailBackupServiceList',
  props: {
    'computeId': String
  },
  mounted () {
    this.$router.push({ name: 'virtual-machine-details-backup-list', params: { computeId: this.computeId } })
  },
  created () {
    getBackupIP(this.computeId)
      .then((backupIP) => {
        console.log('>?>>>>>>>>>> backup IP' + backupIP)
      })
  }
}
</script>
