<template>
  <tr>
    <td>
      <span class="snap-title">
        <img src="@/assets/images/icon-network-green.svg" alt="">
        <router-link :to="{ name: 'network-detail', params: { 'networkId': network['id'] }}">{{ network['network_name'] }}</router-link>
      </span>
    </td>
    <td>
      <div class="ip-meta" v-if="attachedPrivateIP">
        <span class="ip-status c-gray">IP</span>
        <span class="snap-status c-yellow"> {{ attachedPrivateIP }}</span>
      </div>
    </td>
    <td>{{ networkType(network.external) }}</td>
    <td>{{ isAttached ? 'YES' : 'NO' }}</td>
    <action-row :compute-id="computeId" :network-id="network.id" :is-attached="isAttached"></action-row>
  </tr>
</template>

<script>
import ActionRow from './VirtualMachineDetailsNetworksListRowActions'
import _ from 'lodash'

export default {
  name: 'VirtualMachineDetailNetworksListRow',
  props: ['computeId', 'network'],
  components: {
    ActionRow
  },
  computed: {
    isAttached () {
      let computeId = this.computeId
      let attachedComputesId = _.map(this.network['network_compute_mapping'], 'compute_id')
      return _.includes(attachedComputesId, computeId)
    },
    attachedPrivateIP () {
      let _this = this
      let attachedComputeList = this.network.network_compute_mapping
      if (attachedComputeList.length > 0) {
        let compute = _.filter(attachedComputeList, { 'compute_id': _this.computeId })
        if (compute.length > 0) {
          return compute[0].private_ip
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  methods: {
    networkType (type) {
      return (type) ? 'External' : 'Internal'
    }
  }
}
</script>
