<template>
      <table style="width:100%;" cellspacing="0">
        <thead>
        <tr>
          <th>Name</th>
          <th>Backend IPs</th>
          <th>Updated</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <template v-if="serverFarms.length > 0">
          <server-farm-list-row v-for="sf in sortedServerFarmList" :key="sf.id" :sf="sf"
                                @sfUnPause="unPauseSf($event)"
                                @sfPause="pauseSf($event)"
                                @sfRemove="removeSf($event)">
          </server-farm-list-row>
        </template>
        <template v-else>
          <tr>
            <td colspan="5">
              <div class="text-center">
                <h3 style="margin: 15px 0; color: rgb(144, 164, 174);">No farms available.</h3>
              </div>
            </td>
          </tr>
        </template>
        </tbody>
      </table>
</template>

<script>
import { mapGetters } from 'vuex'
import ServerFarmListRow from '@/components/LoadBalancerServerFarmsListRow'
import _ from 'lodash'

export default {
  components: {
    serverFarmListRow: ServerFarmListRow
  },
  computed: {
    ...mapGetters('serverFarms', ['serverFarms']),
    sortedServerFarmList () {
      let _this = this
      return _.sortBy(_this.serverFarms, ['name'])
    }
  }
}
</script>
