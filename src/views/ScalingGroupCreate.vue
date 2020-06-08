<template>
  <div>
    <div class="hidden row">
      <div class="col-xs-12">
        <h1><a href="#"><span><img src="@/assets/images/icon-add.svg" alt=""></span> New Instance</a></h1>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
        <form novalidate="novalidate">
          <create-sg-source ref="sgSource" :vm-image="image" @vm-image-changed="updateImage"></create-sg-source>
          <create-sg-name ref="sgName" :sg-name="name" :vm-image="image"
                          @sg-name-changed="updateName"
                          @sg-username-changed="updateVMUserName"
                          @sg-password-changed="updateVMPassword"
                          @sg-cluster-size-changed="updateClusterSize"></create-sg-name>
          <create-sg-flavor ref="sgSize" :vm-image="image" :vm-flavor="flavor" @vm-flavor-changed="updateFlavor"></create-sg-flavor>
          <create-sg-network ref="sgNetworks" :vm-network="network" @vm-network-changed="updateNetwork"></create-sg-network>
          <create-sg-security-groups ref="sgSecurityGroups" :vm-security-groups="securityGroups" @vm-security-groups-changed="updateSecurityGroups"></create-sg-security-groups>
        </form>
      </div>
      <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12 sticky">
        <div class="cloud-sidebar">
          <create-vm-project-limits></create-vm-project-limits>
          <create-vm-estimated-costs class="hidden"></create-vm-estimated-costs>
          <create-vm-summary :p-summary="$data" @vm-create="validateInputs"></create-vm-summary>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from 'vuex-store'
import ScalingGroupCreateName from '@/components/ScalingGroupCreateName'
import ScalingGroupCreateSource from '@/components/ScalingGroupCreateSource.vue'
import ScalingGroupCreateFlavor from '@/components/VirtualMachineCreateSize.vue'
import ScalingGroupCreateNetwork from '@/components/ScalingGroupCreateNetwork.vue'
import ScalingGroupCreateSecurityGroups from '@/components/ScalingGroupCreateSecurityGroups.vue'

import VirtualMachineCreateAccess from '@/components/VirtualMachineCreateAccess.vue'
import VirtualMachineCreateProjectLimits from '@/components/VirtualMachineCreateProjectLimits.vue'
import VirtualMachineCreateEstimatedCosts from '@/components/VirtualMachineCreateEstimatedCosts.vue'
import VirtualMachineCreateSummary from '@/components/VirtualMachineCreateSummary.vue'

export default {
  components: {
    createSgName: ScalingGroupCreateName,
    createSgSource: ScalingGroupCreateSource,
    createSgFlavor: ScalingGroupCreateFlavor,
    createSgNetwork: ScalingGroupCreateNetwork,
    createSgSecurityGroups: ScalingGroupCreateSecurityGroups,

    createVmAccess: VirtualMachineCreateAccess,
    createVmProjectLimits: VirtualMachineCreateProjectLimits,
    createVmEstimatedCosts: VirtualMachineCreateEstimatedCosts,
    createVmSummary: VirtualMachineCreateSummary
  },

  methods: {
    showConfirmation (isReady) {
      if (!isReady) {
        return this.showAlert('Create Scaling Group', 'Your entries seems incorrect, please correct it first', 'error')
      }
      store.dispatch('confirmation/showConfirmation', { title: 'Create Scaling Group', msg: 'Are you sure you wish to create scaling group?' })
        .then((cnf) => {
          this.createVm()
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    validateInputs: function () {
      if (this.$refs.sgSource.isValidInput() && this.$refs.sgName.isValidInput() && this.$refs.sgSize.isValidInput() && this.$refs.sgNetworks.isValidInput() && this.$refs.sgSecurityGroups.isValidInput()) {
        return this.showConfirmation(true)
      }
      this.showConfirmation(false)
    },
    updateName: function (updatedName) {
      this.name = updatedName
    },
    updateVMUserName: function (updatedVMUserName) {
      this.vMUserName = updatedVMUserName
    },
    updateVMPassword: function (updatedPassword) {
      this.password = updatedPassword
    },
    updateImage: function (image) {
      this.image = image
    },
    updateFlavor: function (flavor) {
      this.flavor = flavor
    },
    updateNetwork: function (network) {
      this.network = network
    },
    updateSecurityGroups: function (securityGroups) {
      this.securityGroups = securityGroups
    },
    updateClusterSize: function (clusterSize) {
      this.clusterSize = clusterSize
    },
    createVm: function () {
      this.$nextTick(() => {
        document.body.scrollTop = 0 // For Safari
        document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
      })
      store.dispatch('scalingGroups/create', this.$data)
        .then(() => {
          // this.$refs['success-notification'].show()
          this.$router.push({ name: 'scaling-groups' })
        })
        .catch((response) => {
          this.error_msg = `response ${response.statusText}`
        })
        .finally(() => {
          store.dispatch('loader/removeMessage', { type: 'create-vm' })
        })
      console.log('Scaling group creation request received')
    },
    showAlert (title, message, errorType = '') {
      this.$swal({
        type: errorType,
        title: title,
        html: message
      })
    }
  },

  data: function () {
    return {
      name: null,
      vMUserName: null,
      password: null,
      image: null,
      flavor: null,
      network: null,
      securityGroups: null,
      clusterSize: null
    }
  }
}
</script>
