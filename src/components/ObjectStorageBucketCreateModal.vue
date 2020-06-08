<template>
  <bootstrap-modal ref="objectStorageBucketCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Bucket Details</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group" :class="{ 'has-error': $v.bucketName.$dirty && $v.bucketName.$error }">
          <label class="col-lg-3 control-label">Bucket Name</label>
          <div class="col-lg-9">
            <input class="form-control" placeholder="" v-model="bucketName" name="bucketName" type="text">
            <span class="help-block" v-if="$v.bucketName.$dirty && !$v.bucketName.required">Bucket name is required</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error': $v.isPublic.$dirty && $v.isPublic.$error }">
          <label class="col-sm-3 control-label">Access Level</label>
          <div class="col-sm-9">
            <select class="form-control" v-model="isPublic" name="isPublic">
              <option value="true">Public</option>
              <option value="false">Private</option>
            </select>
            <span class="help-block" v-if="$v.isPublic.$dirty && !$v.isPublic.required">Access level is required</span>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="validateInputs()">Create</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { listBuckets } from '../utils/ObjectStorageUtils'

export default {
  name: 'NetworksBucketCreateModal',
  mixins: [validationMixin],
  props: {
    'pShow': Number
  },
  data () {
    return {
      bucketName: '',
      isPublic: true
    }
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  validations: {
    bucketName: { required },
    isPublic: { required }
  },
  methods: {
    showModal () {
      this.$refs.objectStorageBucketCreateModal.open()
    },
    hideModal () {
      this.$refs.objectStorageBucketCreateModal.close()
    },
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Create Bucket', msg: 'Are you sure you wish to create bucket?' })
        .then((cnf) => {
          this.create()
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    validateInputs () {
      this.$v.bucketName.$touch()
      this.$v.isPublic.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.create()
      }
    },
    create () {
      let data = {}
      let _this = this
      data['name'] = this.bucketName
      data['is_public'] = this.isPublic

      store.dispatch('objectStorage/create', data)
        .then((response) => {
          console.log(response.status)
          if (response.status) {
            this.$notify({
              group: 'success',
              title: 'Success',
              type: 'success',
              duration: 10000,
              text: 'New bucket created.'
            })
          }
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          listBuckets()
          _this.hideModal()
          // _this.$router.push({ name: 'home', params: { 'destination': 'volumes' } })
        })
    }
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
