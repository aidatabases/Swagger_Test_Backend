<template>
  <div>
    <div style="background-color: indigo; color: #ffffff; padding: 5px 10px;">
      Selected Bucket: {{ selectedBucket }}
      <button v-if="showObjectUploadButton" class="btn btn-xs btn-default" @click.prevent="showModal()">Upload Object</button>
    </div>
    <table v-if="objects.length > 0" class="table table-striped table-condensed">
      <thead>
        <tr>
          <td>Slno</td>
          <td>File Name</td>
          <td>Size</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(object, index) in objects" :key="object.id">
          <td>{{ index + 1 }}</td>
          <td>{{ object.name }}</td>
          <td>{{ object.bytes }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      <p>Bucket is empty</p>
    </div>
    <file-upload-modal :p-show="showFileUploadModal" :bucket="bucket" @file-uploaded="fileUploaded"></file-upload-modal>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
import FileUploadModal from './ObjectStoreFileUploadModal'

export default {
  name: 'ObjectStorageBucketObjectList',
  props: ['bucket', 'objects'],
  data () {
    return {
      showFileUploadModal: -1
    }
  },
  components: {
    FileUploadModal
  },
  computed: {
    selectedBucket () {
      return (Object.keys(this.bucket).length > 1) ? this.bucket.name : 'No bucket selected'
    },
    showObjectUploadButton () {
      return (Object.keys(this.bucket).length > 1)
    }
  },
  methods: {
    showModal () {
      this.showFileUploadModal = Math.floor(Math.random() * Math.floor(100))
    },
    fileUploaded (bucketId) {
      console.log('Bucket1: ' + bucketId)
      this.$emit('file-uploaded', bucketId)
    }
  }
}
</script>
