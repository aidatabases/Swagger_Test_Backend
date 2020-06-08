<template>
  <div class="btn-group" role="group">
    <button class="btn btn-default" @click.prevent="stopService" v-if="isRunning" type="button" v-tooltip.top="'Stop'">
      <i class="fa fa-stop"></i>
    </button>
    <button class="btn btn-default" @click.prevent="startService" v-if="!isRunning" type="button" v-tooltip.top="'Start'">
      <i class="fa fa-play"></i>
    </button>
    <button class="btn btn-default" @click.prevent="removeService" v-if="isRemovable" type="button" v-tooltip.top="'Delete'">
      <i class="fa fa-trash"></i>
    </button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'

export default {
  name: 'GatewayServicesRowActions',
  props: {
    'pGatewayService': Object
  },
  computed: {
    ...mapGetters('gateway', ['gateway', 'services']),
    ...mapGetters('providers', ['providers']),
    ...mapGetters('projects', ['projects']),
    isRunning () {
      return this.pGatewayService.device_status === 'running'
    },
    isRemovable () {
      return this.pGatewayService.service_name !== 'sshpiper'
    }

  },
  methods: {
    init () {
    },
    startService () {
      store.dispatch('confirmation/showConfirmation', { title: 'Start Service', msg: 'Are you sure To start Service ? ' })
        .then((cnf) => {
          this.$emit('gateway-service-start', this.pGatewayService['id'])
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    stopService () {
      store.dispatch('confirmation/showConfirmation', { title: 'Stop Service', msg: 'Are you sure To Stop Service ? ' })
        .then((cnf) => {
          this.$emit('gateway-service-stop', this.pGatewayService['id'])
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    removeService () {
      store.dispatch('confirmation/showConfirmation', { title: 'Remove Service', msg: 'Your action will Remove the service, Are you sure to perform this action ? ' })
        .then((cnf) => {
          this.$emit('gateway-service-remove', this.pGatewayService['id'])
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    }
  },
  created () {
    this.init()
  }
}
</script>
