<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <div class="head-box clearfix" v-if="isVmAvailable">
        <img :src="getOsImgUrl(vm.image.os)" alt="">
        <div class="head-info">
          <h1>{{ computeName }}</h1>
          <div class="head-meta clearfix">
            <span class="head-status">{{ status }}</span>
            <div class="head-opts">
              <span>{{ vCpu }} vCPU</span>
              <span><unit-filter :size="ramSize" :unit="'GB'"></unit-filter> RAM</span>
              <span><unit-filter :size="diskSize" :unit="'GiB'"></unit-filter> BLOCK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
      <div class="head-box" v-if="isVmAvailable">
        <ul>
          <li>
            <span class="label label-danger">PRIVATE IP</span> <span class="label c-white">{{ privateIp }}</span>
            <!--<span class="label label-info">-->
              <i @click.prevent="showModal()" class="fa fa-chevron-circle-down" aria-hidden="true" style="cursor: pointer;"></i>
            <!--</span>-->
          </li>
          <li v-if="floatingIps"><span class="label c-green">GATEWAY IP</span> <span class="label c-white">{{ floatingIps }}</span></li>
          <li class="full">
            <span class="label label-info">How to Access</span>
            <span class="label c-white">
              <div v-if="vm.image.os=='Windows'">Configure Gateway to Access using RDP</div>
              <div v-else> ssh <code>&lt;username&gt;</code>-{{ vm.private_ip }}@{{ vm.floating_ip }} </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <private-ip-list-modal :p-show="showPrivateIpListModal" :private-ips="privateIps" :floating-ip="floatingIps"></private-ip-list-modal>
  </div>
</template>

<script>
import { getOsImgUrl } from '@/utils/Utils'
import privateIpListModal from './VirtualMachineDetailInfoIpModal'
import filter from '../components/_common/Filter'
import _ from 'lodash'

export default {
  name: 'VirtualMachineDetailInfo',
  props: ['vm'],
  data () {
    return {
      showPrivateIpListModal: -1
    }
  },
  components: {
    privateIpListModal,
    UnitFilter: filter
  },
  computed: {
    isVmAvailable () {
      let _this = this
      return _.size(_this.vm)
    },
    computeId () {
      return this.vm.id
    },
    computeName () {
      return this.vm.instance_name
    },
    vCpu () {
      return this.vm.flavor.vcpus
    },
    ramSize () {
      return this.vm.flavor.ram
    },
    diskSize () {
      return this.vm.flavor.disk
    },
    status () {
      return (this.vm.hasOwnProperty('_meta')) ? this.vm._meta['status'] : this.vm.status
    },
    privateIp () {
      if (this.vm.compute_network_mapping.length > 0) {
        return this.vm.compute_network_mapping[0]['private_ip']
      } else {
        return this.vm.private_ip
      }
    },
    privateIps () {
      return this.vm.compute_network_mapping
    },
    floatingIps () {
      return this.vm.floating_ip
    }
  },
  methods: {
    getOsImgUrl,
    showModal () {
      this.showPrivateIpListModal = Math.floor(Math.random() * Math.floor(100))
    }
  }
}
</script>
