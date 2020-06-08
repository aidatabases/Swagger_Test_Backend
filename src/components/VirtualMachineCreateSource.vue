<template>
  <div class="acc-content-row has-error">
    <a class="acc-head" href="#opt-src" data-toggle="collapse">Operating System </a>
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
                          <v-popover class="text-right">
                            <span class="fa fa-info-circle text-info info-btn"></span>
                            <template slot="popover">
                              <table class="table-condensed">
                                <tr>
                                  <th>Name</th>
                                  <td class="text-right">{{ image.name }}</td>
                                </tr>
                                <tr>
                                  <th>Architecture</th>
                                  <td class="text-right">{{ image.os_architecture }}</td>
                                </tr>
                                <tr>
                                  <th>Version</th>
                                  <td class="text-right">{{ image.os_version }}</td>
                                </tr>
                                <tr>
                                  <th>Description</th>
                                  <td class="text-right">{{ image.description }}</td>
                                </tr>
                              </table>
                            </template>
                          </v-popover>
                          <strong>{{image.name}}</strong>
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
                <div v-for="snapshot in snapshots" :key="snapshot.id" class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                  <div class="radio-option widget-block">
                     <label>
                      <input type="radio" name="optionsRadio" :value="snapshot.image_id" v-model="selectedImage">
                        <div class="radio-box">
                          <div class="radio-head">
                            <v-popover class="text-right">
                              <span><small>({{snapshot.compute.instance_name}})</small></span>
                              <span class="fa fa-info-circle text-info info-btn"></span>
                              <template slot="popover">
                                <table class="table-condensed">
                                  <tr>
                                    <th>Name</th>
                                    <td class="text-right">{{ snapshot.snapshot_name }}({{ snapshot.compute.image.name }})</td>
                                  </tr>
                                  <tr>
                                    <th>Instance Name</th>
                                    <td class="text-right">{{snapshot.compute.instance_name}}</td>
                                  </tr>
                                  <tr>
                                    <th>Architecture</th>
                                    <td class="text-right">{{ snapshot.compute.image.os_architecture }}</td>
                                  </tr>
                                  <tr>
                                    <th>Version</th>
                                    <td class="text-right">{{ snapshot.compute.image.os_version }}</td>
                                  </tr>
                                  <tr>
                                    <th>Description</th>
                                    <td class="text-right">{{ snapshot.compute.image.description }}</td>
                                  </tr>
                                </table>
                              </template>
                            </v-popover>
                            <strong>{{snapshot.snapshot_name}}</strong>
                            <img :src="getOsImgUrl(snapshot.compute.image.os)">
                          </div>
                          <div class="radio-foot">{{snapshot.compute.image.os_version}} x {{snapshot.compute.image.os_architecture}}</div>
                        </div>
                    </label>
                  </div>
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
import { listSnapshots } from '@/utils/SnapshotUtil'

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
      'selectedImage': this.vmImage,
      'snapshots': []
    }
  },

  computed: {
    ...mapGetters('images', ['images']),
    availableImageList () {
      let _this = this
      return _.filter(_this.images, { 'is_active': true, 'public': true })
    }
  },

  methods: {
    init () {
      let _this = this
      store.cache.dispatch('images/list', {})
      listSnapshots()
        .then((snapshots) => {
          _this.snapshots = snapshots
        })
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

<style scoped>
  .info-btn { padding: 4px; }
  .info-btn:hover { color: red; }
</style>
