<template>
  <td>
    <div class="btn-group">
      <div class="btn-group" role="group">
        <button v-if="!isAttached" v-tooltip.top="'Attach Network'" type="button" class="btn btn-success" @click.prevent="showConfirmation('ATTACH')">
          <i class="fa fa-sign-in fa-lg"></i>
        </button>
        <button v-if="isAttached"
                v-tooltip.top="'Detach Network'"
                type="button"
                class="btn btn-warning"
                @click.prevent="showConfirmation('DETACH')">
          <i class="fa fa-sign-out fa-lg"></i>
        </button>
      </div>
    </div>
  </td>
</template>

<script>
import store from 'vuex-store'
import { attachNetwork, detachNetwork } from '../utils/NetworkUtils'

export default {
  name: 'VirtualMachineDetailsNetworksListRowActions',
  props: ['computeId', 'networkId', 'isAttached'],
  methods: {
    attach () {
      attachNetwork(this.computeId, this.networkId)
    },
    detach () {
      detachNetwork(this.computeId, this.networkId)
    },
    showConfirmation (actionType) {
      store.dispatch('confirmation/showConfirmation', { title: actionType + ' NETWORK', msg: 'Are you sure you wish to ' + actionType.toLowerCase() + ' network?' })
        .then(() => {
          if (actionType === 'ATTACH') {
            this.attach()
          } else if (actionType === 'DETACH') {
            this.detach()
          } else {
            console.log('Invalid action type')
          }
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    }
  }
}
</script>
