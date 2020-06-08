<template>
  <div>
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <form>
        <div class="acc-content-row resize">
          <div class="clearfix">
            <a class="acc-head">Resize Instance</a>
            <div class="resize-opt hidden">
              <span>Automatic Partitioning</span>
              <label class="switch">
                <input checked="" type="checkbox">
                <span class="switch-round"></span>
              </label>
            </div>
          </div>
          <div class="acc-content">
            <div class="tab-content">
              <div class="option-content">
                <div class="row">
                  <template v-if="isResizeOptionsAvailable">
                    <div v-for="flavor in flavorsList" :key="flavor.id" class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                      <div class="option-size widget-block">
                        <label>
                          <input type="radio" name="optionsSize" id="optionsSize1" :value="flavor.id" v-model="selectedFlavor">
                          <div class="size-box">
                            <div class="size-head">
                              <div class="size-heading clearfix">
                                <i class="fa fa-file-text-o" aria-hidden="true"></i>
                                <strong>{{ flavor.name }}</strong>
                                <i class="fa fa-star-o" aria-hidden="true"></i>
                              </div>
                              <div class="size-content clearfix">
                                <div class="size-meta-box">vCPU <span>{{ flavor.vcpus }}</span></div>
                                <div class="size-meta-box">RAM <unit-filter :size="flavor.ram" :unit="'GB'"></unit-filter></div>
                                <div class="size-meta-box">STORAGE <unit-filter :size="flavor.disk" :unit="'GiB'"></unit-filter></div>
                              </div>
                            </div>
                            <div class="size-foot">
                              <span>{{ flavor.cost }}</span> &#x20b9; / MONTH (EST)
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <div class="text-center">
                      <h3 style="margin: 15px 0; border: none; color: rgb(144, 164, 174);">No option available</h3>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="col-lg-3 col-md-3 col-sm-12 col-xs-12">
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
          <button :disabled="!isResizeOptionsAvailable" class="btn btn-cloud btn-block" @click="showConfirmation">Resize</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import VirtualMachineCreateProjectLimits from '@/components/VirtualMachineCreateProjectLimits.vue'
import { resizeVm, getOne } from '@/utils/VirtualMachinesUtil'
import { listFlavors } from '@/utils/FlavorUtil'
import filter from './_common/Filter'
import _ from 'lodash'

export default {
  name: 'VirtualMachineDetailResize',
  props: ['computeId'],
  data () {
    return {
      'flavorsList': {},
      'vm': {},
      'selectedFlavor': ''
    }
  },
  computed: {
    ...mapGetters('flavors', ['flavors']),
    isResizeOptionsAvailable () {
      let _this = this
      return !_.isEmpty(_this.flavorsList)
    }
  },
  components: {
    createVmProjectLimits: VirtualMachineCreateProjectLimits,
    UnitFilter: filter
  },
  methods: {
    showConfirmation () {
      store.dispatch('confirmation/showConfirmation', { title: 'Resize Virtual Machine', msg: 'Are you sure you wish to resize virtual machine?' })
        .then((cnf) => {
          resizeVm(this.computeId, this.selectedFlavor)
          this.$router.push('/virtual-machines')
        })
        .catch((e) => {
          console.log('Rejecting user request')
        })
    },
    init () {
      let _this = this
      getOne(this.computeId)
        .then((selectedCompute) => {
          _this.vm = selectedCompute
        })
    },
    filterFlavorsList () {
      listFlavors()
        .then((flavors) => {
          this.flavorsList = flavors.filter(flavor => flavor.weight > this.vm.flavor.weight)
        })
    }
  },
  created () {
    this.init()
    this.filterFlavorsList()
  },
  watch: {
    'selectedFlavor': function (val, ov) {
      this.$emit('vm-flavor-changed', this.selectedFlavor)
    }
  }
}
</script>
