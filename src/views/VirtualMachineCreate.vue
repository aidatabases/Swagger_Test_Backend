<template>
    <div>
      <div class="hidden row">
        <div class="col-xs-12">
          <h1><a href="#"><span><img src="@/assets/images/icon-add.svg" alt=""></span> New Instance</a></h1>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-9 col-md-9 col-sm-12 col-xs-12">
          <form novalidate="true" autocomplete="off">
            <create-vm-source ref="vmSource" :vm-image="image" @vm-image-changed="updateImage"></create-vm-source>
            <create-vm-name ref="vmName" :vm-name="name" :vm-image="image" @vm-name-changed="updateName" @vm-username-changed="updateVMUserName" @vm-password-changed="updateVMPassword"></create-vm-name>
            <create-vm-size ref="vmSize" :vm-image="image" :vm-flavor="flavor" @vm-flavor-changed="updateFlavor"></create-vm-size>
            <create-vm-volumes ref="vmVolumes" v-if="false" :vm-volumes="volumes" @vm-volumes-changed="updateVolumes"></create-vm-volumes>
            <create-vm-boot-volume-type :vm-boot-volume-type="bootFromVolume" @vm-boot-volume-changed="updateBootVolume"></create-vm-boot-volume-type>
            <create-vm-network ref="vmNetworks" :vm-network="network" @vm-network-changed="updateNetwork"></create-vm-network>
            <create-vm-security-groups ref="vmSecurityGroups" :vm-security-groups="securityGroups" @vm-security-groups-changed="updateSecurityGroups"></create-vm-security-groups>
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
import VirtualMachineCreateSecurityGroups from '@/components/VirtualMachineCreateSecurityGroups.vue'
import VirtualMachineCreateNetwork from '@/components/VirtualMachineCreateNetwork.vue'
import VirtualMachineCreateVolumes from '@/components/VirtualMachineCreateVolumes.vue'
import VirtualMachineCreateSize from '@/components/VirtualMachineCreateSize.vue'
import VirtualMachineCreateSource from '@/components/VirtualMachineCreateSource.vue'
import VirtualMachineCreateName from '@/components/VirtualMachineCreateName.vue'
import VirtualMachineCreateProjectLimits from '@/components/VirtualMachineCreateProjectLimits.vue'
import VirtualMachineCreateEstimatedCosts from '@/components/VirtualMachineCreateEstimatedCosts.vue'
import VirtualMachineCreateSummary from '@/components/VirtualMachineCreateSummary.vue'
import VirtualMachineCreateBootVolume from '@/components/VirtualMachineCreateBootVolume.vue'

export default {
  components: {
    createVmName: VirtualMachineCreateName,
    createVmSource: VirtualMachineCreateSource,
    createVmSize: VirtualMachineCreateSize,
    createVmVolumes: VirtualMachineCreateVolumes,
    createVmNetwork: VirtualMachineCreateNetwork,
    createVmSecurityGroups: VirtualMachineCreateSecurityGroups,
    createVmProjectLimits: VirtualMachineCreateProjectLimits,
    createVmEstimatedCosts: VirtualMachineCreateEstimatedCosts,
    createVmSummary: VirtualMachineCreateSummary,
    createVmBootVolumeType: VirtualMachineCreateBootVolume
  },

  methods: {
    showConfirmation (isReady) {
      if (!isReady) {
        return store.dispatch('confirmation/showConfirmation', { title: 'Create Virtual Machine', msg: `Your Entries Seems Incorrect, please correct it First` })
          .then((cnf) => {
          })
      }
      store.dispatch('confirmation/showConfirmation', { title: 'Create Virtual Machine', msg: 'Are you sure you wish to create virtual machine?' })
        .then((cnf) => {
          this.createVm()
        })
    },
    validateInputs: function () {
      if (this.$refs.vmSource.isValidInput() && this.$refs.vmName.isValidInput() && this.$refs.vmSize.isValidInput() && this.$refs.vmNetworks.isValidInput() && this.$refs.vmSecurityGroups.isValidInput()) {
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
      this.vMPassword = updatedPassword
    },
    updateImage: function (image) {
      this.image = image
    },
    updateFlavor: function (flavor) {
      this.flavor = flavor
    },
    updateVolumes: function (volumes) {
      this.volumes = volumes
    },
    updateNetwork: function (network) {
      this.network = network
    },
    updateSecurityGroups: function (securityGroups) {
      this.securityGroups = securityGroups
    },
    createVm: function () {
      this.$nextTick(() => {
        document.body.scrollTop = 0 // For Safari
        document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
      })
      store.dispatch('virtualMachines/CREATE', this.$data)
        .then(() => {
          this.$router.push({ name: 'virtual-machines' })
        })
        .finally(() => {
          store.dispatch('loader/removeMessage', { type: 'create-vm' })
        })
    },
    updateBootVolume: function (bootVolumeType) {
      this.bootFromVolume = bootVolumeType
    }
  },

  data: function () {
    return {
      componentsUnderValidation: [],
      name: null,
      vMUserName: null,
      vMPassword: null,
      image: null,
      flavor: null,
      network: null,
      volumes: [],
      securityGroups: null,
      bootFromVolume: true
    }
  }
}
</script>
