<template>
  <div class="row">
    <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
      <div class="head-box clearfix">
        <img src="assets/images/icon-linux.png" alt="">
        <div class="head-info">
          <h1>{{ lb.name }}</h1>
          <div class="head-meta clearfix">
            <div class="head-opts">
              <!--<span>{{ getSelectedProviderName }}</span>
              <span>{{ getSelectedProjectName }}</span>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-5 col-md-5 col-sm-12 col-xs-12">
      <div class="head-box">
        <ul>
          <li><span class="label label-danger">PRIVATE IP</span> <span class="label"><mark>{{ lb.lb_device_ip }}</mark></span></li>
          <!--<li><span class="label label-info">GATEWAY IP</span> <span class="label"><mark>{{ vm.floating_ip }}</mark></span></li>-->
        </ul>
        <!--<span class="label label-info">How to Access</span><span class="label"><mark> ssh root:{{ vm.private_ip }}@{{ vm.floating_ip }} </mark></span>-->
      </div>
    </div>
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
export default {
  props: ['lb'],
  data () {
    return {
      // status: 'Loading..'
    }
  },
  computed: {
    // ...mapGetters('providers', ['getSelectedProviderName']),
    // ...mapGetters('projects', ['getSelectedProjectName'])
  }
}
</script>
