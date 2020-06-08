<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Cluster Size</th>
          <th>LB IP</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="scalingGroups.length > 0" v-for="(scalingGroup, index) in scalingGroups">
          <tr :key="index">
            <td>
              <div class="content-box clearfix">
                <img :src="getOsImgUrl(scalingGroup.image.os)" alt="">
                <div class="content-info">
                  <h4>{{ scalingGroup.name }}</h4>
                  <div class="content-opts">
                    <span>{{ selectedFlavor(scalingGroup.flavor_id).vcpus }} vCPU</span>
                    <span><unit-filter :size="selectedFlavor(scalingGroup.flavor_id).ram" :unit="'GB'"></unit-filter> RAM</span>
                    <span><unit-filter :size="selectedFlavor(scalingGroup.flavor_id).disk" :unit="'GiB'"></unit-filter> BLOCK</span>
                  </div>
                </div>
                <a :disabled="!!scalingGroup.task_id" class="acc-head collapsed" :href="`#opt-${scalingGroup.id}`" data-toggle="collapse" aria-expanded="false" @click.prevent="showComputeList(scalingGroup.id)"></a>
              </div>
            </td>
            <td>{{ scalingGroup.cluster_size }}</td>
            <scaling-group-row-ip :p-lb-vm-ip="scalingGroup.lb_vm_ip"></scaling-group-row-ip>
            <scaling-group-status :p-scaling-group-id="scalingGroup.id"></scaling-group-status>
            <scaling-group-row-actions :p-scaling-group="scalingGroup" v-on:show-resize-modal="resizeScalingGroup(scalingGroup)"></scaling-group-row-actions>
          </tr>
          <scaling-group-vm-list :toggle-compute-list="toggleComputeList" :selected-row-group-id="selectedRowGroupId" :scaling-group="scalingGroup" :scaling-group-id="scalingGroup.id" :key="scalingGroup.id"></scaling-group-vm-list>
        </template>
        <template v-if="scalingGroups.length < 1">
          <tr>
            <td colspan="5">
              <h3 class="text-center" style="margin: 0; color: #90A4AE;">No scaling group found</h3>
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div class="col-xs-12 clearfix">
      <pagination :records="totalRecords" :page="currentPage" :per-page="recordPerPage" :options="paginationConfig" @paginate="pageChanged"></pagination>
    </div>

    <scaling-group-resize-modal
        :p-show="showScalingGroupResizeModal"
        :scaling-group="editedItem"
    ></scaling-group-resize-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { listScalingGroups } from '@/utils/ScalingGroupsUtil'
import scalingGroupStatus from '@/components/ScalingGroupsListStatus'
import scalingGroupRowIp from '@/components/ScalingGroupsListRowIp'

import scalingGroupRowActions from '@/components/ScalingGroupsRowActions'
import scalingGroupVmList from '@/components/ScalingGroupsListRowVmList'
import ScalingGroupResizeModal from '@/components/ScalingGroupResizeModal'
import { getOsImgUrl } from '@/utils/Utils'
import filter from './_common/Filter'
import Pagination from 'vue-pagination-2'

export default {
  data () {
    return {
      isActionPerforming: true,
      selectedRowGroupId: -1,
      toggleComputeList: false,
      showScalingGroupResizeModal: -1,
      editedIndex: -1,
      editedItem: {
        id: 0,
        cluster_size: 0,
        flavor_id: 0
      },
      defaultItem: {
        id: 0,
        cluster_size: 0,
        flavor_id: 0
      },
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
    scalingGroupRowActions,
    // ScalingGroupVmDetails: () => import('@/components/ScalingGroupsListRowVmDetails')
    scalingGroupVmList,
    scalingGroupStatus,
    scalingGroupRowIp,
    ScalingGroupResizeModal,
    UnitFilter: filter
  },
  computed: {
    ...mapGetters('scalingGroups', ['scalingGroups', 'totalRecords']),
    ...mapGetters('flavors', ['flavorById']),
    ...mapGetters('images', ['imageById'])
  },
  methods: {
    getOsImgUrl,
    selectedFlavor (flavorId) {
      if (!flavorId) {
        return
      }
      return this.flavorById(flavorId)
    },
    fetchScalingGroups () {
      // List Scaling Groups
      listScalingGroups(this.recordPerPage, this.recordOffset)
    },
    resizeScalingGroup (scalingGroup) {
      this.editedIndex = this.scalingGroups.indexOf(scalingGroup)
      this.editedItem = Object.assign({}, scalingGroup)
      this.editedItem = scalingGroup
      // this.selectedScalingGroupId = scalingGroupId
      // this.selectedClusterSize = clusterSize
      this.showScalingGroupResizeModal = Math.floor(Math.random() * Math.floor(100))
    },
    showComputeList (groupId) {
      this.selectedRowGroupId = groupId
      this.toggleComputeList = !this.toggleComputeList
    },
    pageChanged (page) {
      this.currentPage = page
      this.recordOffset = (this.recordPerPage * this.currentPage) - this.recordPerPage
      this.loadVms()
    }
  },
  mounted () {
    this.fetchScalingGroups()
  }
}
</script>
