<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container">
        <div class="snap-table-head clearfix">
          <h1>Volumes</h1>
          <button v-if="canWriteVolumes" type="button" class="btn btn-cloud" @click.prevent="showModal()">Create New Volume</button>
        </div>
        <volume-list></volume-list>
      </div>
      <volume-create-modal v-if="canWriteVolumes" :p-show="showVolumeCreateModal"></volume-create-modal>
    </div>
  </div>
</template>

<script>
import VolumeList from '@/components/VolumeList'
import VolumeCreateModal from '@/components/VolumeCreateModal'
import * as acl from '@/utils/Acls'

export default {
  data () {
    return {
      showVolumeCreateModal: -1
    }
  },
  components: {
    volumeList: VolumeList,
    volumeCreateModal: VolumeCreateModal
  },
  computed: {
    ...acl
  },
  methods: {
    showModal () {
      this.showVolumeCreateModal = Math.floor(Math.random() * Math.floor(100))
    }
  }
}
</script>
