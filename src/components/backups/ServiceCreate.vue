<template>
  <div class="row">
    <form class="col-sm-12">
      <div class="col-sm-8 form-group" :class="{ 'has-error': $v.backupFolderLocation.$dirty && $v.backupFolderLocation.$error }">
        <input v-model="backupFolderLocation" type="text" class="form-control" placeholder="Enter File/Folder Location">
        <span class="help-block" v-if="$v.backupFolderLocation.$dirty && !$v.backupFolderLocation.required">Please enter a name</span>
        <span class="help-block" v-if="$v.backupFolderLocation.$dirty && !$v.backupFolderLocation.directoryPathValidation">Invalid Directory path detected!</span>
      </div>
      <div class="col-sm-4">
        <button type="button" class="btn btn-cloud btn-block" @click.prevent="initializeService()">Take Backup</button>
      </div>
    </form>
  </div>
</template>
<script>
import store from 'vuex-store'
import { validationMixin } from 'vuelidate'
import { createInstanceService } from '@/utils/BackupUtil'
import { required, helpers } from 'vuelidate/lib/validators'

const directoryPathValidation = helpers.regex('directoryPathValidation', /^(\/[A-Z a-z 0-9]*)+$/)

export default {
  name: 'BackupServiceCreate',
  props: {
    'computeId': String
  },
  data () {
    return {
      backupFolderLocation: ''
    }
  },
  validations: {
    backupFolderLocation: { required, directoryPathValidation }
  },
  mixins: [validationMixin],
  methods: {
    initializeService () {
      this.$v.backupFolderLocation.$touch()
      if (this.$v.$anyError) {
        return false
      }
      let _this = this
      store.dispatch('confirmation/showConfirmation', { title: 'Confirmation', msg: 'Are you sure you want to take backup of Folder?' })
        .then(() => {
          return createInstanceService(this.computeId, this.backupFolderLocation)
        })
        .then(() => {
          _this.backupFolderLocation = ''
          _this.$v.$reset()
        })
        .then(() => {
          _this.$router.push({ name: 'virtual-machine-details-backup-list', params: { computeId: this.computeId } })
        })
    }
  }
}
</script>
