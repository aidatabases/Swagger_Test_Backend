<template>
  <bootstrap-modal ref="objectStorageFileUploadModal" :need-header="true" :need-footer="true" :size="'large'">
    <div slot="title">
      <h4 class="modal-title">Upload File To : {{ bucketName }}</h4>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-md-8" style="border-right: 1px solid #ccc;">
          <div class="form-group row">
            <label class="control-label col-sm-3" for="file">File:</label>
            <div class="col-sm-9">
              <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
            </div>
          </div>

          <div class="form-group row">
            <label class="control-label col-sm-3" for="file-name">File name:</label>
            <div class="col-sm-9">
              <input type="text" class="form-control" id="file-name">
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <p>NOTE:<br>Delimiters ('/') are allowed in the file name to place the new file into a folder that will be created when the file is uploaded (to any depth of folders).</p>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" v-on:click="submitFile()">Upload</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import bootstrapModal from 'vue2-bootstrap-modal'

export default {
  name: 'ObjectStoreFileUploadModal',
  props: {
    'pShow': Number,
    'bucket': Object
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  data () {
    return {
      file: '',
      fileName: ''
    }
  },
  computed: {
    bucketId () {
      return this.bucket.id
    },
    bucketName () {
      return this.bucket.name
    }
  },
  methods: {
    showModal () {
      this.$refs.objectStorageFileUploadModal.open()
    },
    hideModal () {
      this.$refs.objectStorageFileUploadModal.close()
    },
    reset () {
      this.fileName = ''
      this.file = ''
    },
    submitFile () {
      let formData = new FormData()
      formData.append('file', this.file)
      // if (this.fileName !== '') {
      formData.append('name', 'File_' + Math.floor((Math.random() * 1000) + 1))
      // }

      store.dispatch('objectStorage/uploadBucketObjects', {
        bucketId: this.bucketId,
        file: formData
      }).then(res => {
        if (res.status === 200) {
          this.hideModal()
          console.log('File uploaded')
        }
      }).finally(() => {
        this.$emit('file-uploaded', this.bucketId)
        this.reset()
      })
    },
    handleFileUpload () {
      this.file = this.$refs.file.files[0]
    }
  },
  mounted () {
    this.reset()
  },
  watch: {
    'pShow': function (cv, pv) {
      var that = this
      this.$nextTick(() => {
        that.showModal()
      })
    }
  }
}
</script>
