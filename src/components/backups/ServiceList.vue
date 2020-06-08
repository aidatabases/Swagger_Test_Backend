<template>
  <table style="width:100%;" cellspacing="0">
    <thead>
      <tr>
        <th>path</th>
        <th>Level</th>
        <th>Type</th>
        <th>Size</th>
        <th>Backup Date</th>
      </tr>
    </thead>
    <tbody>
      <template v-if="!isServiceRunning">
        <tr><td colspan="5"> Seems no backup is scheduled!</td></tr>
      </template>
      <template v-else-if="isServiceRunning && !doesHaveBackup">
        <tr><td colspan="5">
          <span>Backup service is Running for Folders {{backups}} </span>
          <b v-for="fol in listFolders" :key="fol">{{fol}}</b>
          <span> but no backup listed yet.</span>
        </td></tr>
      </template>
      <template>
        <template v-for="(_backups, _serviceId) in backups">
          <tr v-for="backup in _backups" :key="backup.id">
            <td>{{backup['name']}}</td>
            <td>{{backup['level']}}</td>
            <td>{{backup['type']}}</td>
            <td>{{backup['size']['value']}} {{backup['size']['unit']}}</td>
            <td>{{backup['completionTime']}}</td>
          </tr>
        </template>
      </template>
    </tbody>
  </table>
</template>
<script>
import { listServicesByComputeId, listBackupsByBackupServiceId } from '@/utils/BackupUtil'
export default {
  name: 'BackupServiceList',
  props: {
    'computeId': String
  },
  data () {
    return {
      backupServices: {},
      backups: {}
    }
  },
  computed: {
    isServiceRunning () {
      return Object.keys(this.backupServices).length > 0
    },
    doesHaveBackup () {
      return Object.keys(this.backups).length > 0
    },
    listFolders () {
      let folders = []
      for (let serviceId in this.backupServices) {
        folders.push(this.backupServices[serviceId]['backup_path'])
      }
      return folders
    }
  },
  methods: {
    listServices () {
      let _this = this
      listServicesByComputeId(this.computeId)
        .then((backupServices) => {
          let result = []
          for (let backupService of backupServices) {
            _this.$set(_this.backupServices, [backupService['id']], backupService)
            result.push(listBackupsByBackupServiceId(backupService['id'])
              .then((_backups) => {
                debugger
                _this.$set(_this.backups, [backupService['id']], _backups.backups)
              }))
          }
          return Promise.all(result)
        })
    }
  },
  created () {
    this.listServices()
  }
}
</script>
