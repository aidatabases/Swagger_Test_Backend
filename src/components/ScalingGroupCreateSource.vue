<template>
  <div class="acc-content-row has-error">
    <a class="acc-head" href="#opt-src" data-toggle="collapse">Operating System</a>
    <span class="help-block" v-if="$v.selectedImage.$dirty && !$v.selectedImage.required">Please Choose one of the available Images !</span>
    <div id="opt-src" class="collapse in">
      <div class="acc-content">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#image">Images</a></li>
          <li><a data-toggle="tab" href="#snapshot">Snapshots</a></li>
          <li><a data-toggle="tab" href="#volume" class="hidden">Volumes</a></li>
        </ul>
        <div class="tab-content">
          <div id="image" class="tab-pane fade in active">
            <div class="option-content">
              <div class="row">
                <div v-for="image in availableImageList" :key="image.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div class="radio-option widget-block">
                    <label>
                      <input type="radio" name="optionsRadio" :value="image.id" v-model="selectedImage">
                      <div class="radio-box">
                        <div class="radio-head">
                          <strong class="wrap-text">{{ image.name }}</strong>
                          <img :src="getOsImgUrl(image.os)">
                        </div>
                        <div class="radio-foot">{{image.os_version}} x {{image.os_architecture}}</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="snapshot" class="tab-pane fade">
            <div class="option-content">
              <div class="row">
                <template v-if="availableSnapshots.length > 0">
                  <div v-for="snapshot in availableSnapshots" :key="snapshot.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                    <div class="radio-option">
                      <label>
                        <input type="radio" name="optionsRadio" :value="snapshot.id" v-model="selectedImage">
                        <div class="radio-box">
                          <div class="radio-head">
                            <strong class="wrap-text">{{ snapshot.name }}</strong>
                            <img :src="getOsImgUrl(snapshot.os)">
                          </div>
                          <div class="radio-foot">{{ snapshot.os_version }} x {{ snapshot.os_architecture }}</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </template>
                <div v-else>
                  <p class="text-center text-muted">No snapshot available</p>
                </div>
              </div>
            </div>
          </div>
          <div id="volume" class="tab-pane fade">
            <div class="option-content">
              <div class="radio-option">
                <label>
                  <input type="radio" name="optionsRadio" value="option9">
                  <div class="radio-box">
                    <div class="radio-head">
                      <strong>cirros custom1</strong>
                      <img src="@/assets/images/icon-cirros-black.png">
                    </div>
                    <div class="radio-foot">x64_v2</div>
                  </div>
                </label>
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
import { getOsImgUrl } from '@/utils/Utils'

export default {
  name: 'VirtualMachineCreateSource',
  props: {
    'vmImage': Number
  },
  validations: {
    selectedImage: {
      required
    }
  },
  mixins: [validationMixin, cloudValidationMixin],

  data: function () {
    return {
      'selectedImage': this.vmImage
    }
  },

  computed: {
    ...mapGetters('images', ['images']),
    // ...mapGetters('snapshots', ['snapshots']),
    availableImageList () {
      let _this = this
      return _.filter(_this.images, { 'is_active': true, 'public': true })
    },
    availableSnapshots () {
      let _this = this
      return _.filter(_this.images, { 'is_active': true, 'public': false })
    }
  },

  methods: {
    init () {
      store.cache.dispatch('images/list', {})
      // store.cache.dispatch('snapshots/LIST_ALL', {})
    },

    selectRandom () {
      this.selectedImage = _.chain(this.images)
        .pluck('id')
        .sample()
        .value()
    },

    getOsImgUrl
  },

  created () {
    this.init()
  },

  watch: {
    'selectedImage': function (cv, ov) {
      this.$emit('vm-image-changed', this.selectedImage)
    },

    'images': function (cv, pv) {
      if (_.isEmpty(this.selectedImage)) {
        this.selectRandom()
      }
    }
  }
}
</script>
