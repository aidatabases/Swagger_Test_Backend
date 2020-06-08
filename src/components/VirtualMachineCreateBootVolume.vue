<template>
  <div class="acc-content-row">
    <a class="acc-head" href="#boot-volume-type" data-toggle="collapse">Boot Volume</a>
    <div id="boot-volume-type" class="collapse in">
      <div class="acc-content">
        <div class="tab-content">
          <div class="option-content">
            <!--<pre>{{ selectedBootVolumeType }}</pre>-->
            <div class="row">
              <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                <div class="radio-option widget-block">
                  <label>
                    <input disabled type="radio" name="selectedBootVolume" value="false" v-model="selectedBootVolumeType">
                    <div class="radio-box" style="cursor: not-allowed;">
                      <div class="radio-head">
                        <strong>Local<br>Storage</strong>
                        <img src="../assets/images/local-block-storage.svg">
                      </div>
                      <div class="radio-foot">Boot from local disk</div>
                    </div>
                  </label>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-6 col-xs-12">
                <div class="radio-option widget-block">
                  <label>
                    <input type="radio" name="selectedBootVolume" value="true" v-model="selectedBootVolumeType">
                    <div class="radio-box">
                      <div class="radio-head">
                        <strong>Network<br>Storage</strong>
                        <!--<i class="fa fa-globe" aria-hidden="true"></i>-->
                        <img src="../assets/images/network-block-storage.svg">
                      </div>
                      <div class="radio-foot">Boot from network disk</div>
                    </div>
                  </label>
                </div>
              </div>
              <div v-if="selectedBootVolumeType === true || selectedBootVolumeType === 'true'" class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <h5>Network Disk</h5>
                <ul>
                  <li>Dedicated external block device is assigned</li>
                  <li>Creation of Virtual Machine takes longer</li>
                  <li>Ideal for production environment</li>
                </ul>
              </div>
              <div v-else class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <h5>Local Disk</h5>
                <ul>
                  <li>Local block device is assigned</li>
                  <li>Virtual Machine creation is faster</li>
                  <li>Ideal for development environment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VirtualMachineCreateBootVolume',
  props: ['vmBootVolumeType'],
  data: function () {
    return {
      selectedBootVolumeType: this.vmBootVolumeType
    }
  },
  watch: {
    'selectedBootVolumeType': function (cv, ov) {
      this.$emit('vm-boot-volume-changed', this.selectedBootVolumeType)
    }
  }
}
</script>

<style scoped>
  .radio-head img {width: 45px !important;}
</style>
