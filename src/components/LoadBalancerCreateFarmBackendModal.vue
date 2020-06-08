<template>
  <bootstrap-modal ref="backendListModal" :need-header="true" :need-footer="true" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Backend List</h4>
    </div>
    <div slot="body">
      <form class="form-horizontal">
        <div class="form-group" :class="{ 'has-error': $v.selectedIp.$dirty && $v.selectedIp.$error }">
          <label class="col-sm-2 control-label">Bind IP</label>
          <div class="col-sm-10">
            <select v-model="selectedIp" class="form-control">
              <option value="">Select</option>
              <option :value="vm.private_ip" v-for="vm in vms" :key="vm.id">{{ vm.instance_name }} ({{ vm.private_ip }})</option>
            </select>
            <span class="help-block" v-if="$v.selectedIp.$dirty && !$v.selectedIp.required">Please enter a valid bind IP address</span>
          </div>
        </div>
        <div class="form-group" :class="{ 'has-error': $v.selectedPort.$dirty && $v.selectedPort.$error }">
          <label class="col-sm-2 control-label">Bind Port</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model.trim="selectedPort">
            <span class="help-block" v-if="$v.selectedPort.$dirty && $v.selectedPort.$error">Please enter a valid bind port number</span>
          </div>
        </div>
      </form>
    </div>
    <div slot="footer">
      <button type="submit" class="btn btn-primary" @click.prevent="add">Add</button>
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import bootstrapModal from 'vue2-bootstrap-modal'
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  props: {
    'pShow': Number,
    'vms': Array,
    'privateIpList': Array
  },
  data () {
    return {
      selectedIp: null,
      selectedPort: null
    }
  },
  validations: {
    selectedIp: { required },
    selectedPort: { required, numeric }
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  methods: {
    clearForm () {
      this.selectedIp = ''
      this.selectedPort = ''
      this.$v.$reset()
    },
    showModal () {
      this.clearForm()
      this.$refs.backendListModal.open()
    },
    hideModal () {
      this.$refs.backendListModal.close()
    },
    add () {
      this.$v.$touch()

      if (this.$v.$anyError) {
        return false
      }

      this.$emit('backendIpSelected', {
        ip: this.selectedIp,
        port: this.selectedPort
      })
      this.hideModal()
      this.selectedIp = ''
      this.selectedPort = ''
    }
  },
  created () {
    this.selectedIp = ''
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
