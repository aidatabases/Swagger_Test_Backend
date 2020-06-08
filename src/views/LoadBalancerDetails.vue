<template>
  <div>
    <div class="page-head">
      <lb-info :lb="lbDetails"></lb-info>
    </div>
    <div class="page-content">
      <div class="col-xs-12">
        <div class="snap-table-container fip">
          <div class="snap-table-head clearfix">
            <h2>Server Farms</h2>
            <router-link class="btn btn-sm btn-cloud" :to="{ name: 'CreateFarm', params: { id: lbId }}">Create Server Farm</router-link>
          </div>
          <server-farms-list></server-farms-list>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LbInfo from '@/components/LoadBalancerDetailInfo'
import ServerFarmsList from '@/components/LoadBalancerServerFarmsList'
import { getOne } from '../utils/LoadBalancerUtils'
import _ from 'lodash'
import { listFarms } from '../utils/ServerFarmUtils'

export default {
  data () {
    return {
      lbId: this.$route.params.id,
      lbDetails: []
    }
  },
  components: {
    lbInfo: LbInfo,
    serverFarmsList: ServerFarmsList
  },
  mounted () {
    getOne(this.lbId)
      .then(lb => {
        this.lbDetails = _.isEmpty(lb) ? [] : lb
      })

    listFarms(this.lbId)
  }
}
</script>
