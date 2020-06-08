<template>
  <div>
    <table class="table">
      <thead>
      <tr>
        <th class="col-md-3">Name</th>
        <th class="col-md-4">Attached To</th>
        <th class="col-md-1">Status</th>
        <th class="col-md-1">Actions</th>
      </tr>
      </thead>
      <tbody>
      <template v-if="availableVolumes.length > 0">
        <volume-row v-for="(volume, key) in availableVolumes"
                    :key="key"
                    :p-volume="volume"
                    :p-show-short="showShort"
        ></volume-row>
      </template>
      <template v-else>
        <tr>
          <td colspan="4">
            <h3 class="text-center" style="margin: 0; color: #90A4AE;">No Volumes found !</h3>
          </td>
        </tr>
      </template>
      </tbody>
    </table>
    <div class="col-xs-12 clearfix">
      <pagination :records="totalVolumeRecords" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import VolumeRow from '@/components/VolumeListRow'
import { listVolumes } from '@/utils/VolumesUtil'
import _ from 'lodash'
import Pagination from 'vue-pagination-2'

export default {
  props: {
    'pSelectedVm': {
      default: null
    }
  },
  data () {
    return {
      currentPage: 1,
      recordPerPage: 10,
      recordOffset: 0,
      paginationConfig: {
        chunk: 10
      }
    }
  },
  components: {
    Pagination,
    volumeRow: VolumeRow
  },
  computed: {
    ...mapGetters('volumes', ['volumes', 'totalVolumeRecords']),
    sortedVolumes () {
      return _.orderBy(this.volumes, ['id'], ['desc'])
    },
    selectedComputeId () {
      let computeId = null
      if (this.pSelectedVm !== null) {
        computeId = parseInt(this.pSelectedVm)
      }
      return computeId
    },
    availableVolumes () {
      return this.sortedVolumes
    },
    showShort () {
      return !!this.pSelectedVm
    }
  },
  methods: {
    loadVolumes () {
      listVolumes(this.recordPerPage, this.recordOffset, this.selectedComputeId)
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.loadVolumes()
    }
  },
  mounted () {
    this.loadVolumes()
  }
}
</script>
