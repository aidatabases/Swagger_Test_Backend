<template>
  <bootstrap-modal ref="vmDetailsIpListModal" :need-header="true" :need-footer="false" :size="'medium'">
    <div slot="title">
      <h4 class="modal-title">Attached Private IP List</h4>
    </div>
    <div slot="body">
      <div class="row">
        <div class="col-md-12">
          <table class="table table-striped">
            <thead>
              <tr>
                <td>PRIVATE IP</td>
                <td>SSH COMMAND</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ip in privateIps" :key="ip.id">
                <td>{{ ip.private_ip }}</td>
                <td>ssh <code>&lt;username&gt;</code>-{{ ip.private_ip }}@{{ floatingIp }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-default" @click="hideModal">Close</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import bootstrapModal from 'vue2-bootstrap-modal'
export default {
  name: 'VirtualMachineDetailInfoIpModal',
  // props: ['pShow', 'privateIps', 'floatingIp']
  props: {
    'pShow': Number,
    'privateIps': Array,
    'floatingIp': String
  },
  components: {
    bootstrapModal: bootstrapModal
  },
  methods: {
    showModal () {
      this.$refs.vmDetailsIpListModal.open()
    },
    hideModal () {
      this.$refs.vmDetailsIpListModal.close()
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
