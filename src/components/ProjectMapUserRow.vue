<template>
  <tr>
    <td>{{pUser.first_name}}</td>
    <td>{{pUser.username}}</td>
    <td>{{pUserRole}}</td>
    <td class="text-center" v-if="pCanWriteUsers">
      <button v-if="!showConfirmation" v-tooltip="'Detach User'" @click.prevent="showConfirmation = true"><i class="text-danger fa fa-user-times"></i></button>
      <div v-if="showConfirmation">
        Are you sure? <button class="btn btn-xs btn-success" @click.prevent="detachUser">Yes</button> <button class="btn btn-xs btn-danger" @click.prevent="showConfirmation = false">No</button>
      </div>
    </td>
  </tr>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      showConfirmation: false
    }
  },
  props: {
    pUser: Object,
    pProjectId: Number,
    pUserRole: String,
    pCanWriteUsers: Boolean
  },
  computed: {
    ...mapGetters('auth', ['selectedProject', 'selectedOrganisation'])
  },
  methods: {
    detachUser () {
      this.showConfirmation = false
      let payload = {}
      payload['user_id_list'] = []
      payload['user_id_list'].push(this.pUser.id)
      payload['organisation_id'] = this.selectedOrganisation
      payload['project_id'] = this.pProjectId
      store
        .dispatch('projects/detachProjectUsers', { organisationId: this.selectedOrganisation, projectId: this.pProjectId, payload })
        .then((users) => {
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'User detached successfully!'
          })
          this.$emit('project-user-detached')
        })
    }
  }
}
</script>

<style scoped>
  .btn { padding: 2px 4px; margin-right: 5px; }
</style>
