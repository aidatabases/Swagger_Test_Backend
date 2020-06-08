<template>
  <bootstrap-modal ref="scalingGroupResizeModal" :need-header="true" :need-footer="false" :size="'large'">
    <div slot="title">
      <h4 class="modal-title">Resize Scaling Group</h4>
    </div>
    <div slot="body" class="clearfix scaling-group-resize-modal-wrapper">
      <div class="row" id="step-one" v-if="currentStage === 'one'">
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <form>
            <div class="acc-content-row resize">
              <div class="acc-content">
                <div class="tab-content">
                  <div class="option-content">
                    <div class="row">
                      <div class="form-group" :class="{ 'has-error': $v.updatedClusterSize.$dirty && $v.updatedClusterSize.$error }">
                        <label>Cluster Size</label>
                        <input v-model="updatedClusterSize" type="number" class="form-control" placeholder="Enter cluster size">
                        <span class="help-block" v-if="$v.updatedClusterSize.$dirty && $v.updatedClusterSize.$error">Please enter a valid size between 1 to 10</span>
                      </div>
                      <div class="form-group">
                        <label>Flavor</label>
                        <select v-if="flavors.length > 0" class="form-control" v-model="updatedFlavorId">
                          <option v-for="flavor in flavors" :key="flavor.id" :value="flavor.id">{{ flavor['name'] }}</option>
                        </select>
                      </div>
                      <div>
                        <label>Flavor Detail</label>
                        <div class="option-size widget-block">
                          <label>
                            <div class="size-box">
                              <div class="size-head">
                                <div class="size-heading clearfix">
                                  <i class="fa fa-file-text-o" aria-hidden="true"></i>
                                  <strong>{{ updatedFlavor['name'] }}</strong>
                                  <i class="fa fa-star-o" aria-hidden="true"></i>
                                </div>
                                <div class="size-content clearfix">
                                  <div class="size-meta-box">vCPU <span>{{ updatedFlavor.vcpus }}</span></div>
                                  <div class="size-meta-box">RAM <unit-filter :size="updatedFlavor.ram" :unit="'GB'"></unit-filter></div>
                                  <div class="size-meta-box">STORAGE <unit-filter :size="updatedFlavor.disk" :unit="'GiB'"></unit-filter></div>
                                </div>
                              </div>
                              <div class="size-foot">
                                <span>{{ updatedFlavor.cost }}</span> &#x20b9; / MONTH (EST)
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <div class="clearfix"></div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
          <div class="cloud-sidebar">
            <create-vm-project-limits></create-vm-project-limits>
            <div class="status-box hidden">
              <h3>Estimated Costs</h3>
              <p>
                <span>Monthly Costs/Instance</span>
                <strong><img src="@/assets/images/icon-ind-curr.svg" alt=""> 30,15</strong>
              </p>
              <p>
                <span>Monthly Costs/Project</span>
                <strong><img src="@/assets/images/icon-ind-curr.svg" alt=""> 560</strong>
              </p>
              <div class="progress">
                <div class="progress-bar progress-bar-complete" style="width: 45%"></div>
                <div class="progress-bar progress-bar-diff" style="width: 24%"></div>
                <span class="btn-info">12.5%</span>
              </div>
            </div>
            <div class="status-box">
              <h3 class="hidden">Summary</h3>
              <ul class="hidden">
                <li>Fixie tote.</li>
                <li>Fixie tote.</li>
                <li>Synth polaro.</li>
                <li>Synth polaro.</li>
                <li>Retro occupy.</li>
                <li>Tousled foo.</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-md-12 text-center">
          <button class="btn btn-sm btn-cloud" @click.stop="nextStep">Continue</button>
        </div>
      </div>
      <div class="row" id="step-two" v-if="currentStage === 'two'">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 resource-estimate-wrapper">
          <div class="cloud-sidebar">
            <create-vm-project-limits></create-vm-project-limits>
          </div>
        </div>
        <div class="col-md-12">
          <div class="panel panel-info">
            <div class="panel-heading">Current Resource : </div>
            <div class="panel-body">
              <div class="col-md-6 col-sm-12 col-sx-12" style="border-right: 1px solid #ccc;">
                <ul>
                  <li>Cluster Size: <span>{{ existingClusterSize }}</span></li>
                  <li>
                    Flavor Details:
                    <ul>
                      <li>NAME: {{ existingFlavor['name'] }}</li>
                      <li>vCPU: {{ existingFlavor.vcpus }}</li>
                      <li>RAM: <unit-filter :size="existingFlavor.ram" :unit="'GB'"></unit-filter></li>
                      <li>STORAGE: <unit-filter :size="existingFlavor.disk" :unit="'GiB'"></unit-filter></li>
                      <li>COST: 0 &#x20b9; / Month (EST)</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="col-md-6 col-sm-12 col-sx-12">
                <h4>Total Resource</h4>
                <ul>
                  <li>Cluster Size: {{ existingClusterSize }}</li>
                  <li>vCPU: {{ existingFlavor.vcpus * existingClusterSize }}</li>
                  <li>RAM: <unit-filter :size="existingFlavor.ram * existingClusterSize" :unit="'GB'"></unit-filter></li>
                  <li>STORAGE: <unit-filter :size="existingFlavor.disk * existingClusterSize" :unit="'GiB'"></unit-filter></li>
                  <li>COST: {{ existingFlavor.cost * existingClusterSize }} &#x20b9; / Month (EST)</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="panel panel-info">
            <div class="panel-heading">New Resource : </div>
            <div class="panel-body">
              <div class="col-md-6 col-sm-12 col-sx-12" style="border-right: 1px solid #ccc;">
                <h4>Selected Options</h4>
                <ul>
                  <li>Cluster Size: <span>{{ updatedClusterSize }}</span></li>
                  <li>
                    Flavor Details:
                    <ul>
                      <li>NAME: {{ updatedFlavor.name }}</li>
                      <li>VCPU: {{ updatedFlavor.vcpus }}</li>
                      <li>RAM: <unit-filter :size="updatedFlavor.ram" :unit="'GB'"></unit-filter></li>
                      <li>STORAGE: <unit-filter :size="updatedFlavor.disk" :unit="'GiB'"></unit-filter></li>
                      <li>COST: {{ updatedFlavor.cost }} &#x20b9; / Month (EST)</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div class="col-md-6 col-sm-12 col-sx-12">
                <h4>Total Resource</h4>
                <ul>
                  <li>Cluster Size: {{ updatedClusterSize }}</li>
                  <li>vCPU: {{ updatedFlavor.vcpus * updatedClusterSize}}</li>
                  <li>RAM: <unit-filter :size="updatedFlavor.ram * updatedClusterSize" :unit="'GB'"></unit-filter></li>
                  <li>STORAGE: <unit-filter :size="updatedFlavor.disk * updatedClusterSize" :unit="'GiB'"></unit-filter></li>
                  <li>COST: {{ updatedFlavor.cost * updatedClusterSize }} &#x20b9; / Month (EST)</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button class="btn btn-sm btn-cloud-default" @click.prevent="currentStage = 'one'">Back</button>
            <button class="btn btn-sm btn-cloud" @click.prevent="resizeScalingGroup()">Update</button>
          </div>
        </div>
      </div>
    </div>
  </bootstrap-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { resizeScalingGroup } from '@/utils/ScalingGroupsUtil'
import bootstrapModal from 'vue2-bootstrap-modal'
import filter from './_common/Filter'
import { validationMixin } from 'vuelidate'
import { required, numeric, minValue, maxValue } from 'vuelidate/lib/validators'

import VirtualMachineCreateProjectLimits from '@/components/VirtualMachineCreateProjectLimits.vue'
export default {
  name: 'ScalingGroupResizeModal',
  mixins: [validationMixin],
  props: {
    'pShow': { type: Number },
    'scalingGroup': { type: Object }
  },
  data () {
    return {
      updatedClusterSize: null,
      updatedFlavorId: null,
      currentStage: 'one'
    }
  },
  validations: {
    updatedClusterSize: {
      required,
      numeric,
      minValue: minValue(1),
      maxValue: maxValue(10)
    }
  },
  components: {
    bootstrapModal: bootstrapModal,
    createVmProjectLimits: VirtualMachineCreateProjectLimits,
    UnitFilter: filter
  },
  computed: {
    ...mapGetters('flavors', ['flavors', 'flavorById']),
    ...mapGetters('scalingGroups', ['scalingGroupById']),
    scalingGroupId () {
      return this.scalingGroup.id
    },
    existingClusterSize () {
      return this.scalingGroup['cluster_size']
    },
    existingFlavorId () {
      return this.scalingGroup['flavor_id']
    },
    existingFlavor () {
      let defaultData = {
        name: '',
        vcpus: 0,
        ram: 0,
        disk: 0,
        cost: 0
      }
      if (this.scalingGroup['id'] < 1) {
        return defaultData
      }
      return this.flavorById(this.scalingGroup.flavor_id)
    },
    updatedFlavor () {
      let defaultData = {
        name: '',
        vcpus: 0,
        ram: 0,
        disk: 0,
        cost: 0
      }
      if (this.scalingGroup['id'] < 1) {
        return defaultData
      }
      return this.flavorById(this.updatedFlavorId)
    }
  },
  methods: {
    resetValues () {
      this.updatedClusterSize = this.scalingGroup['cluster_size']
      this.updatedFlavorId = this.scalingGroup['flavor_id']
      this.currentStage = 'one'
      this.$v.$reset()
    },
    showModal () {
      this.resetValues()
      this.$refs.scalingGroupResizeModal.open()
    },
    hideModal () {
      this.$refs.scalingGroupResizeModal.close()
    },
    nextStep () {
      this.$v.$touch()
      if (!this.$v.$anyError) {
        this.$v.$reset()
        this.currentStage = 'two'
      }
    },
    resizeScalingGroup () {
      resizeScalingGroup(this.scalingGroupId, this.updatedFlavorId, this.updatedClusterSize)
        .then(() => {
          this.hideModal()
        })
    }
  },
  watch: {
    'pShow': function (cv, pv) {
      var that = this
      this.$nextTick(() => {
        that.showModal()
      })
    },
    scalingGroup () {
      this.updatedClusterSize = this.scalingGroup['cluster_size']
      this.updatedFlavorId = this.scalingGroup['flavor_id']
    }
  }
}
</script>

<style>
  .scaling-group-resize-modal-wrapper .btn { width: 100px !important; margin: 5px; }
  .resource-estimate-wrapper .pro-box { width: 25% !important; }
</style>
