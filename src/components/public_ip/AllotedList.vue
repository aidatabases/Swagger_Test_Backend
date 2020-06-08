<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div>
        <div class="snap-table-head clearfix">
          <h2>Alloted IPs </h2>
        </div>
        <table v-if="allotedIPs.length > 0" style="width:100%;" cellspacing="0">
          <thead>
          <tr>
            <th>Path</th>
            <th>id</th>
          </tr>
          </thead>
          <tbody>
          <template>
            <tr v-for="allotedPublicIp in allotedIPs" :key="allotedPublicIp.id">
              <td>{{allotedPublicIp}}</td>
              <!--<td>{{backup}}</td>-->
            </tr>
          </template>
          </tbody>
        </table>
        <div v-else class="snap-table-body">
          <p class="text-center text-muted">You currently don't have any alloted Public IPs.</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { listAllotedPublicIPByProviderAndProject, listPublicIPByProvider, listRoutableIPByOrganisationProviderAndProject } from '@/utils/PublicIPUtil'
import { mapGetters } from 'vuex'

export default {
  name: 'BackupList',
  data () {
    return {
      allotedIPs: [],
      importedPublicIps: [],
      flotingIPs: []
    }
  },
  computed: {
    ...mapGetters('auth', [
      'organisationId', 'selectedProject', 'selectedProvider'
    ])
  },
  methods: {
    listAllotedPublicIPs () {
      let _this = this
      listAllotedPublicIPByProviderAndProject(this.selectedProvider, this.selectedProject)
        .then((allotedIPs) => {
          _this.allotedIPs = allotedIPs
        })
    },
    listPublicIPs () {
      let _this = this
      listPublicIPByProvider(this.selectedProvider)
        .then((importedPublicIps) => {
          _this.importedPublicIps = importedPublicIps
        })
    },
    listRoutableIP () {
      let _this = this
      listRoutableIPByOrganisationProviderAndProject(this.organisationId, this.selectedProvider, this.selectedProject)
        .then((flotingIPs) => {
          _this.flotingIPs = flotingIPs
        })
    }
  },
  created () {
    this.listAllotedPublicIPs()
    this.listPublicIPs()
    this.listRoutableIP()
  }
}
</script>

<style scoped>
  .snap-table-body { margin-left: 20px; margin-right: 20px; padding-bottom: 20px; }
</style>
