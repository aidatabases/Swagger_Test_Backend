<template>
  <div class="acc-content-row size has-error">
    <a class="acc-head" href="#opt-size" data-toggle="collapse">Size <small class="text-danger">({{selectedFlavorName}})</small></a>
    <span class="help-block" v-if="$v.selectedFlavor.$dirty && !$v.selectedFlavor.required">Please Choose one of the available Sizes !</span>
    <div id="opt-size" class="collapse in">
      <div class="acc-content">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#sml">Small</a></li>
          <li><a data-toggle="tab" href="#med">Medium</a></li>
          <li><a data-toggle="tab" href="#large">Large</a></li>
          <li><a data-toggle="tab" href="#allsize">All</a></li>
          <li><a data-toggle="tab" href="#rec">Recommended</a></li>
          <li><a data-toggle="tab" href="#fav">Favourites</a></li>
        </ul>
        <div class="tab-content">
          <div id="sml" class="tab-pane fade  in active">
            <div class="option-content">
              <div class="row">
                <div v-for="flavor in smallFlavors" :key="flavor.id" class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                  <div class="option-size widget-block">
                    <label>
                      <input type="radio" :value="flavor.id" v-model="selectedFlavor">
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
              </div>
            </div>
          </div>
          <div id="med" class="tab-pane fade">
            <div class="option-content">
              <div class="row">
                <div v-for="flavor in mediumFlavors" :key="flavor.id" class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                  <div class="option-size widget-block">
                    <label>
                      <input type="radio" :value="flavor.id" v-model="selectedFlavor">
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
              </div>
            </div>
          </div>
          <div id="large" class="tab-pane fade">
            <div class="option-content">
              <div class="row">
                <div v-for="flavor in largeFlavors" :key="flavor.id" class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                  <div class="option-size widget-block">
                    <label>
                      <input type="radio" :value="flavor.id" v-model="selectedFlavor">
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
              </div>
            </div>
          </div>
          <div id="rec" class="tab-pane fade">
            <div class="option-content clearfix">
            </div>
          </div>
          <div id="fav" class="tab-pane fade">
            <div class="option-content clearfix">
            </div>
          </div>
          <div id="allsize" class="tab-pane fade">
            <div class="option-content">
              <div class="row">
                <div v-for="flavor in allFlavors" :key="flavor.id" class="col-lg-4 col-md-6 col-sm-6 col-xs-12">
                  <div class="option-size widget-block">
                    <label>
                      <input type="radio" :value="flavor.id" v-model="selectedFlavor">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import _ from 'underscore'
import { validationMixin } from 'vuelidate'
import cloudValidationMixin from '@/components/mixin/Validation'
import { required } from 'vuelidate/lib/validators'
import filter from './_common/Filter'

export default {
  props: {
    'vmFlavor': Number,
    'vmImage': Number
  },

  data: function () {
    return {
      'selectedFlavor': this.vmFlavor
    }
  },

  mixins: [validationMixin, cloudValidationMixin],

  validations: {
    selectedFlavor: {
      required
    }
  },

  components: {
    UnitFilter: filter
  },

  computed: {
    ...mapGetters('flavors', ['flavors']),
    smallFlavors () {
      return _.filter(this.allFlavors, (o) => {
        return o.weight <= 500
      })
    },
    mediumFlavors () {
      return _.filter(this.allFlavors, (o) => {
        return (o.weight > 500 && o.weight <= 1100)
      })
    },
    largeFlavors () {
      return _.filter(this.allFlavors, (o) => {
        return o.weight > 1100
      })
    },
    allFlavors () {
      return _.filter(this.flavors, (o) => {
        return (o.disk >= this.selectedImageMinDisk && o.ram >= this.selectedImageMinRam)
      })
    },
    isSelectedFlavorValid () {
      return _.some(this.allFlavors, { id: this.selectedFlavor })
    },
    selectedImage () {
      return this.imageById()(this.vmImage)
    },
    selectedImageMinDisk () {
      return this.selectedImage ? parseInt(this.selectedImage.min_disk) : 0
    },
    selectedImageMinRam () {
      return this.selectedImage ? parseInt(this.selectedImage.min_ram) : 0
    },
    selectedFlavorName () {
      var flavor = this.flavorById()(this.selectedFlavor)
      return flavor ? flavor.name : null
    }
  },
  methods: {
    init () {
      store.dispatch('flavors/list', {})
    },
    ...mapGetters('images', ['imageById']),
    ...mapGetters('flavors', ['flavorById'])
  },

  watch: {
    'selectedFlavor': function (val, ov) {
      this.$emit('vm-flavor-changed', this.selectedFlavor)
    },
    'vmImage': function (val) {
      if (!this.isSelectedFlavorValid) {
        this.selectedFlavor = null
      }
    }
  },

  created () {
    this.init()
  }
}
</script>
