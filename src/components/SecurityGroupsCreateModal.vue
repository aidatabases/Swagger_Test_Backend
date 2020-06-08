<template>
  <bootstrap-modal ref="securityGroupCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Create Security Group</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal" @submit.prevent="validateInputs">
        <div class="form-group" :class="{ 'has-error' : $v.securityGroupName.$dirty && $v.securityGroupName.$error }">
          <label class="col-lg-4 control-label">Security Group Name</label>
          <div class="col-lg-8">
            <input class="form-control" placeholder="" v-model="securityGroupName" type="text">
            <span class="help-block" v-if="$v.securityGroupName.$dirty && !$v.securityGroupName.required">Please enter security group name.</span>
            <span class="help-block" v-else-if="$v.securityGroupName.$dirty && !$v.securityGroupName.name">Please enter a valid name. Only alphabets, numbers and hyphen is allowed.</span>
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
import bootstrapModal from 'vue2-bootstrap-modal'
import { required } from 'vuelidate/lib/validators'
import { name } from '../lib/vuelidate/CustomValidations'
import { validationMixin } from 'vuelidate'
import store from 'vuex-store'
import { mapGetters } from 'vuex'

export default {
  props: {
    'pShow': Number
  },
  mixins: [validationMixin],
  data () {
    return {
      securityGroupName: ''
    }
  },
  computed: {
    ...mapGetters('auth', ['userId'])
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  validations: {
    securityGroupName: { required, name }
  },
  methods: {
    showModal () {
      this.clearFormFields()
      this.$refs.securityGroupCreateModal.open()
    },
    hideModal () {
      this.$refs.securityGroupCreateModal.close()
    },
    validateInputs () {
      this.$v.securityGroupName.$touch()

      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.create()
      }
    },
    clearFormFields () {
      this.$v.$reset()
      this.securityGroupName = ''
    },
    create () {
      this.hideModal()

      let data = {}
      data['security_group_name'] = this.securityGroupName
      data['user_id'] = this.userId

      store.dispatch('securityGroups/create', { 'payload': data })
        .then(() => {
          store.dispatch('securityGroups/list', {})
          this.$notify({
            group: 'success',
            title: 'Success',
            type: 'success',
            duration: 10000,
            text: 'Security Group created successfully.'
          })
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
