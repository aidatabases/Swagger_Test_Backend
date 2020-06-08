<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div>
        <div class="snap-table-head clearfix">
          <h2>Backups <small> ( Folder: {{pServiceDetails.backup_path}} )</small></h2>
        </div>
        <table v-if="backups.length > 0" style="width:100%;" cellspacing="0">
          <thead>
          <tr>
            <th>id</th>
            <th>Creation Time</th>
            <th>Completion Time</th>
          </tr>
          </thead>
          <tbody>
          <template>
            <tr v-for="backup in backups" :key="backup.id">
              <td>{{backup.shortId}}</td>
              <td>{{backup.creationTime}}</td>
              <td>{{backup.completionTime}}</td>
            </tr>
          </template>
          </tbody>
        </table>
        <div v-else class="snap-table-body">
          <p class="text-center text-muted">You currently don't have any backups of Folder: <b>{{pServiceDetails.backup_path}}</b>.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listBackupsByBackupServiceId } from '@/utils/BackupUtil'

export default {
  name: 'BackupList',
  props: {
    'serviceId': Number,
    'computeId': Number,
    'pServiceDetails': Object
  },
  data () {
    return {
      backups: []
    }
  },
  methods: {
    listBackups () {
      let _this = this
      listBackupsByBackupServiceId(this.serviceId)
        .then((backups) => {
          _this.backups = backups.backups
        })
    }
  },
  created () {
    this.listBackups()
  }
}
</script>

<style scoped>
  .snap-table-body { margin-left: 20px; margin-right: 20px; padding-bottom: 20px; }
</style>
