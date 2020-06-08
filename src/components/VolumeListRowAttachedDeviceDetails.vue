<template>
  <div class="content-box clearfix">
    <template v-if="isComputeAvailable">
      <img :src="getOsImgUrl(compute.image.os)" :alt="compute.image.os">
      <div class="content-info">
        <h4>
          <router-link title="details" :to="{ name: 'virtual-machine-detail', params: { 'computeId': compute.id, 'section': 'volumes' }}">
            {{ compute.instance_name }}
          </router-link>
        </h4>
        <div class="content-opts">
          <span>Mounted at <b>{{ volumeMountPath }}</b></span>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { getOsImgUrl } from '@/utils/Utils'
import { getOne } from '../utils/VirtualMachinesUtil'

export default {
  name: 'VolumeAttachedDeviceDetails',
  props: {
    'volume': Object
  },
  data () {
    return {
      compute: []
    }
  },
  computed: {
    volumeId () {
      return this.volume.id
    },
    computeId () {
      return this.volume.volume_attach_volume[0].compute_id
    },
    volumeMountPath () {
      if (this.isComputeAvailable) {
        let _this = this
        let allAttachedVolumes = this.compute.volume_attach_compute
        let attachedVolume = _.filter(allAttachedVolumes, function (o) {
          return o.volume['id'] === _this.volumeId
        })
        if (_.size(attachedVolume) > 0) {
          return attachedVolume[0].volume_attachment_device_name
        }
        return ''
      }
      return ''
    },
    isComputeAvailable () {
      let _this = this
      return (_.size(_this.compute) > 0)
    }
  },
  methods: {
    getOsImgUrl,
    getComputeDetails () {
      if (this.computeId) {
        getOne(this.computeId)
          .then(vm => {
            this.compute = vm
          })
      }
    }
  },
  watch: {
    volume () {
      this.getComputeDetails()
    }
  },
  mounted () {
    this.getComputeDetails()
  }
}
</script>
