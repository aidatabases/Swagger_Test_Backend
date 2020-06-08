<template>
  <bootstrap-modal ref="lbCreateModal" :need-header="true" :need-footer="true" :size="'medium'">
        <div slot="title">
          <h4 class="modal-title">Create Load Balancer</h4>
        </div>
        <div slot="body">
          <form class="form-horizontal" @submit.prevent="validateInputs">
            <div class="form-group" :class="{ 'has-error': $v.lbName.$dirty && $v.lbName.$error }">
              <label class="col-sm-2 control-label">Name</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" placeholder="Load Balancer Name" v-model.trim="lbName">
                <span class="help-block" v-if="$v.lbName.$dirty && !$v.lbName.required">Load balancer name is required</span>
                <span class="help-block" v-else-if="$v.lbName.$dirty && !$v.lbName.minLength">Minimum 4 characters required</span>
                <span class="help-block" v-else-if="$v.lbName.$dirty && $v.lbName.$error">Please enter a valid name</span>
              </div>
            </div>
          </form>
        </div>
        <div slot="footer">
          <button type="submit" class="btn btn-primary" @click.stop="validateInputs">Create</button>
          <button type="button" class="btn btn-default" @click="hideModal">Close</button>
        </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required, minLength } from 'vuelidate/lib/validators'
import { name } from '../lib/vuelidate/CustomValidations'
import { listLoadBalancers } from '../utils/LoadBalancerUtils'

export default {
  mixins: [validationMixin],
  props: {
    'pShow': Number
  },
  data () {
    return {
      lbName: ''
    }
  },
  validations: {
    lbName: {
      required,
      minLength: minLength(4),
      name
    }
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  computed: {
    ...mapGetters('auth', ['selectedProject']),
    ...mapGetters('auth', ['selectedProvider'])
  },
  methods: {
    clearForm () {
      this.lbName = ''
      this.$v.$reset()
    },
    showModal () {
      this.clearForm()
      this.$refs.lbCreateModal.open()
    },
    hideModal () {
      this.$refs.lbCreateModal.close()
    },
    create () {
      const providerId = this.selectedProvider
      const projectId = this.selectedProject
      let data = {}
      data['name'] = this.lbName
      data['provider_id'] = providerId
      data['project_id'] = projectId

      store.dispatch('loadBalancers/create', { 'providerId': providerId, 'projectId': projectId, 'payload': data })
        .then(() => {
          listLoadBalancers()
        }).finally(() => {
          this.hideModal()
        })
    },
    validateInputs () {
      this.$v.lbName.$touch()
      if (!this.$v.$anyDirty || this.$v.$anyError) {
        return false
      } else {
        this.create()
      }
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
