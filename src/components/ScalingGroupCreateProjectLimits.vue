<template>
  <div class="status-box">
    <h3 class="text-center">Organization Limits<br><small><b>Data Centre Zone</b><br>{{ providerName }}<br>({{providerLocation}})</small></h3>
    <div class="pro-content clearfix">
      <div class="pro-box">
        <radial-progress-bar :diameter="110"
                             :stroke-width="strokeWidth"
                             :completed-steps="consumedVM"
                             :total-steps="allocatedVM"
                             inner-stroke-color='#c4c9d2'
                             :start-color="vmColor"
                             :stop-color="vmColor"
        >
          <p>{{ consumedVM }} / {{ allocatedVM }}<br><small>( {{Math.ceil(consumedVM * 100/allocatedVM)}}% )</small></p>
        </radial-progress-bar>
        <small>Virtual Machines</small>
      </div>
      <div class="pro-box">
        <radial-progress-bar :diameter="110"
                             :stroke-width="strokeWidth"
                             :completed-steps="consumedVcpu"
                             :total-steps="allocatedVcpu"
                             inner-stroke-color='#c4c9d2'
                             :start-color="vcpuColor"
                             :stop-color="vcpuColor"
        >
          <p>{{ consumedVcpu }} / {{ allocatedVcpu }}<br><small>( {{Math.ceil(consumedVcpu * 100/allocatedVcpu)}}% )</small></p>
        </radial-progress-bar>
        <small>CPU</small>
      </div>
      <div class="pro-box">
        <radial-progress-bar :diameter="110"
                             :stroke-width="strokeWidth"
                             :completed-steps="consumedStorage"
                             :total-steps="allocatedStorage"
                             inner-stroke-color='#c4c9d2'
                             :start-color="storageColor"
                             :stop-color="storageColor"
        >
          <p>{{ consumedStorage }} / {{ allocatedStorage }}<br><small>( {{Math.ceil(consumedStorage * 100/allocatedStorage)}}% )</small></p>
        </radial-progress-bar>
        <small>Storage <unit-filter :unit="'GiB'"></unit-filter></small>
      </div>
      <div class="pro-box">
        <radial-progress-bar :diameter="110"
                             :stroke-width="strokeWidth"
                             :completed-steps="consumedMemory"
                             :total-steps="allocatedMemory"
                             inner-stroke-color='#c4c9d2'
                             :start-color="memoryColor"
                             :stop-color="memoryColor"
        >
          <p>{{ consumedMemory }} / {{ allocatedMemory }}<br><small>( {{Math.ceil(consumedMemory * 100/allocatedMemory)}}% )</small></p>
        </radial-progress-bar>
        <small>Memory <abbr title="1 GiB = 1.073741824 GB">(GiB)</abbr></small>
      </div>
    </div>
  </div>
</template>
<script>
import RadialProgressBar from 'vue-radial-progress'
import store from 'vuex-store'
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import { mapGetters } from 'vuex'
import filter from './_common/Filter'

export default {
  mixins: [projectProviderMixin],
  components: {
    radialProgressBar: RadialProgressBar,
    UnitFilter: filter
  },
  computed: {
    ...mapGetters('resourceStats', ['stats', 'statsByName']),
    ...mapGetters('auth', [
      'selectedProject',
      'selectedProvider',
      'selectedOrganisation'
    ]),
    availableVcpu: function () { return this.getAvailable('vcpu') },
    allocatedVcpu: function () { return this.getAllocated('vcpu') },
    consumedVcpu: function () { return this.getConsumed('vcpu') },
    vcpuColor: function () { return this.getStrokeColor(this.consumedVcpu, this.allocatedVcpu) },
    availableMemory: function () { return this.getAvailable('ram') },
    allocatedMemory: function () { return this.getAllocated('ram') },
    consumedMemory: function () { return this.getConsumed('ram') },
    memoryColor: function () { return this.getStrokeColor(this.consumedMemory, this.allocatedMemory) },
    availableStorage: function () { return this.getAvailable('storage') },
    allocatedStorage: function () { return this.getAllocated('storage') },
    consumedStorage: function () { return this.getConsumed('storage') },
    storageColor: function () { return this.getStrokeColor(this.consumedStorage, this.allocatedStorage) },
    availableVM: function () { return this.getAvailable('vm') },
    allocatedVM: function () { return this.getAllocated('vm') },
    consumedVM: function () { return this.getConsumed('vm') },
    vmColor: function () { return this.getStrokeColor(this.consumedVM, this.allocatedVM) }
  },
  data: function () {
    return {
      'strokeWidth': 8
    }
  },
  methods: {
    init () {
      console.log('Hit...............')
      store.dispatch('resourceStats/stats', { 'organisationId': this.selectedOrganisation, 'providerId': this.selectedProvider })
    },
    getAllocated (head) {
      return this.getValue(head, 'allocated')
    },
    getConsumed (head) {
      return this.getValue(head, 'consumed')
    },
    getValue (key1, key2) {
      let value = 0
      try {
        value = this.stats[key1][key2]['value']
      } catch (e) {
        console.log('Got error while fetching stats' + e)
      }
      return value
    },
    getAvailable (head) {
      return this.getValue(head, 'available')
    },
    getStrokeColor (consumed, allocated) {
      let color = '#12a001'
      if (allocated === 0) {
        return color
      }
      if (consumed / allocated > 0.7) {
        color = '#ff0000'
      }
      return color
    }
  },
  created () {
    this.init()
  },

  watch: {
    'selectedNetwork': function (cv, ov) {
      this.$emit('vm-network-changed', this.selectedNetwork)
    }
  }
}
</script>
