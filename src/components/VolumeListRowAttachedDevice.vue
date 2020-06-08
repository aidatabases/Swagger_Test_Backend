<template>
    <td>
      <div v-if="pVolume.task_id !== '' && pVolume.task_id !== null" class="progress-bar-wrapper">
        <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
          Loading...
        </div>
      </div>

      <device-details v-else-if="pIsAttached" :volume="pVolume"></device-details>

      <div v-else-if="!pIsAttached">
        <v-select :disabled="pStatusError"
                  :placeholder="'Select Virtual Machine'"
                  v-model.trim="selectedVmForAssociation"
                  label="instance_name"
                  :reduce="virtualMachines => virtualMachines.id"
                  :options="virtualMachines"
                  :filterable="false"
                  @input="selectVM"
                  @search="onSearch"
        >
          <template slot="no-options">
            Type Virtual Machine name to search. Minimum 3 chars required.
          </template>
        </v-select>
      </div>
    </td>
</template>

<script>
import _ from 'lodash'
import vSelect from 'vue-select'
import VolumeAttachedDeviceDetails from '@/components/VolumeListRowAttachedDeviceDetails.vue'
import 'vue-select/src/scss/vue-select.scss'

export default {
  name: 'VolumeAttachedDevice',
  props: {
    'pVolume': Object,
    'pIsAttached': Boolean,
    'pAttachedVm': Object,
    'pStatusError': Boolean
  },

  data () {
    return {
      selectedVmForAssociation: '',
      virtualMachines: []
    }
  },
  components: {
    deviceDetails: VolumeAttachedDeviceDetails,
    vSelect
  },
  methods: {
    onSearch (query, loading) {
      if (!_.isEmpty(query) && query.length > 2) {
        loading(true)
        this.search(loading, query, this)
      }
    },
    search: _.debounce((loading, query, _this) => {
      _this.$store.dispatch('virtualMachines/SEARCH', { 'limit': 20, 'offset': 0, 'search': query })
        .then(res => {
          _this.virtualMachines = res
          loading(false)
        })
    }, 500),
    selectVM () {
      this.$emit('vm-changed', this.selectedVmForAssociation)
    }
  }
}
</script>
