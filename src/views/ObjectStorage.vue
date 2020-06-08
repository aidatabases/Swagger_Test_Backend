<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container vm scale">
        <div class="snap-table-head clearfix">
          <h1>Object Storage</h1>
          <button type="button" class="btn btn-cloud" @click.prevent="showModal()">Create Bucket</button>
        </div>
        <div class="row">
          <div class="col-md-3">
            <bucket-list v-on:bucketSelected="onBucketChanged"></bucket-list>
          </div>
          <div class="col-md-9">
            <bucket-object-list :bucket="selectedBucket" :objects="selectedBucketObjects" v-on:file-uploaded="fileUploaded"></bucket-object-list>
          </div>
        </div>
      </div>
      <bucket-create-modal :p-show="showBucketCreateModal"></bucket-create-modal>
    </div>
  </div>
</template>

<script>
import BucketList from '../components/ObjectStorageBucketList'
import BucketCreateModal from '../components/ObjectStorageBucketCreateModal'
import BucketObjectList from '../components/ObjectStorageBucketObjectList'
import { listBucketObjects } from '../utils/ObjectStorageUtils'

export default {
  name: 'ObjectStorage',
  data () {
    return {
      showBucketCreateModal: -1,
      selectedBucket: {},
      selectedBucketObjects: []
    }
  },
  components: { BucketCreateModal, BucketList, BucketObjectList },
  methods: {
    showModal () {
      this.showBucketCreateModal = Math.floor(Math.random() * Math.floor(100))
    },
    onBucketChanged (bucket) {
      this.selectedBucket = bucket
      listBucketObjects(bucket.id)
        .then(res => {
          this.selectedBucketObjects = res
        })
    },
    fileUploaded (bucketId) {
      listBucketObjects(bucketId)
        .then(res => {
          this.selectedBucketObjects = res
        })
    }
  }
}
</script>
