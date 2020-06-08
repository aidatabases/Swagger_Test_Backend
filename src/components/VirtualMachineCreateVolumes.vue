<template>
  <div class="acc-content-row">
    <a class="acc-head collapsed" href="#opt-vol" data-toggle="collapse">Additional Volumes</a>
    <div id="opt-vol" class="collapse in">
      <div class="snap-table-container">
        <table style="width:100%;" cellspacing="0">
          <thead>
            <tr v-if="hasVolumes">
              <th class="col-md-2">Connect</th>
              <th class="col-md-2">Name</th>
              <th class="col-md-2">Size</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="hasVolumes" v-for="volume in freeVolumes" :key="volume.id">
              <td>
                <label class="switch">
                  <input type="checkbox" v-model="selectedVolumes" :value="volume.id">
                  <span class="switch-round"></span>
                </label>
              </td>
              <td>{{volume.volume_name}}</td>
              <td><unit-filter :size="volume.volume_size" :format="'GiB'"></unit-filter></td>
            </tr>
            <tr v-else>
              No Volume Found Click here to create One
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { listVolumes } from '@/utils/VolumesUtil'
import { mapGetters } from 'vuex'
import filter from './_common/Filter'

export default {
  name: 'VirtualMachineCreateVolumes',
  props: {
    'vmVolumes': Array
  },

  data: function () {
    return {
      'selectedVolumes': this.vmVolumes
    }
  },

  components: {
    UnitFilter: filter
  },

  computed: {
    ...mapGetters('volumes', ['freeVolumes']),
    hasVolumes: function () {
      return this.freeVolumes.length > 0
    }
  },
  methods: {
    init () {
      listVolumes()
    }
  },
  created () {
    this.init()
  },

  watch: {
    'selectedVolumes': function (volumes, ov) {
      this.$emit('vm-volumes-changed', volumes)
    }
  }
}
</script>
