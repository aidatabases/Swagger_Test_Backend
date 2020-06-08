<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div class="snap-table-head clearfix">
        <h2>Attached Disks</h2>
          <router-link class="btn btn-cloud" title="Manage Storage" :to="{ name: 'volumes'}">Manage Storage</router-link>
      </div>
      <volume-list :p-selected-vm="computeId"></volume-list>
    </div>
  </div>
</template>

<script>
import VolumeList from '@/components/VolumeList'

export default {
  props: ['computeId'],
  components: {
    volumeList: VolumeList
  }
}
</script>
