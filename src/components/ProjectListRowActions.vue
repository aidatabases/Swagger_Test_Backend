<template>
    <td>
      <div v-if="pProject.task_id != null && pProject.task_id != ''" class="btn-group" role="group">
        <button type="button" class="btn btn-default" disabled>
          <i class="fa fa-server"></i>
        </button>
        <button type="button" class="btn btn-default" disabled>
          <i class="fa fa-user-plus"></i>
        </button>
      </div>

      <div v-else class="btn-group" role="group">
        <button type="button" v-tooltip.top="'Manage Provider'" class="btn btn-default" @click.prevent="showProviderMapModal">
          <i class="fa fa-server"></i>
        </button>
        <button type="button" v-tooltip.top="'Manage Project Users'" class="btn btn-default" @click.prevent="showUserMapModal()">
          <i class="fa fa-user-plus"></i>
        </button>
        <!--<button v-if="canWriteUsers && pProject.project_provider_mapping_project.length > 0" type="button" v-tooltip.top="'Manage Project Users'" class="btn btn-default" @click.prevent="showUserMapModal()">
          <i class="fa fa-user-plus"></i>
        </button>
        <button v-else type="button" class="btn btn-default" disabled>
          <i class="fa fa-user-plus"></i>
        </button>-->
      </div>
    </td>
</template>

<script>
import store from 'vuex-store'
import * as acl from '@/utils/Acls'

export default {
  props: ['pProject'],
  computed: {
    ...acl
  },
  methods: {
    showProviderMapModal () {
      store.commit('ui/SHOW_PROJECT_PROVIDER_MAP_MODAL', this.pProject['id'])
    },
    showUserMapModal () {
      store.commit('ui/SHOW_PROJECT_USER_MAP_MODAL', this.pProject['id'])
    }
  }
}
</script>
