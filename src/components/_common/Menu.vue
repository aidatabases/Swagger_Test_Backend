<template>
  <header class="header-section">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 col-md-4 col-sm-4 col-xs-12">
          <div class="logo-grp">
            <a href="#"><img src="@/assets/images/logo-nic.svg" alt="National Informatic Center"></a>
            <a href="#"><img src="@/assets/images/logo-cloud.png" alt="Cloud"></a>
          </div>
        </div>
        <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
          <nav class="main-menu">
            <ul class="clearfix">
              <li class="dropdown">
                <router-link to="/">Dashboard</router-link>
              </li>
              <li class="dropdown">
                <a class="dropdown-toggle active" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                  Data Centre Zone<i class="fa fa-angle-down" aria-hidden="true"></i>
                </a>
                <ul class="dropdown-menu">
                  <!--<li class="current-item"><a href="#">Option 1</a></li>-->
                  <li v-for="provider in providers" :key="provider.id">
                    <a href="#">{{  provider['provider_name'] + ' (' + provider['provider_location'] + ')' }}</a>
                  </li>
                </ul>
              </li>
              <li class="dropdown">
                <router-link to="/projects">Project</router-link>
              </li>
              <li class="dropdown">
                <a class="dropdown-toggle active" href="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Resources<i class="fa fa-angle-down" aria-hidden="true"></i></a>
                <ul class="dropdown-menu">
                  <li><router-link to="/virtual-machines">Virtual Machines</router-link></li>
                  <li><router-link to="/scaling-groups">Scaling Groups</router-link></li>
                  <li v-if="canReadNetworks"><router-link to="/security-groups">Security Groups</router-link></li>
                  <li v-if="canReadVolumes"><router-link to="/volumes">Storage</router-link></li>
                  <li class="hidden"><router-link to="/object-storage">Object Storage</router-link></li>
                  <li v-if="canReadSnapshots" class="hidden"><router-link to="/snapshots">Snapshots</router-link></li>
                  <li class="hidden"><a href="#">Network Map</a></li>
                  <li class="hidden"><a href="#">Floating IP's</a><span>3</span></li>
                  <li v-if="canReadNetworks"><router-link to="/networks">Networks</router-link></li>
                  <!-- <li><router-link to="/public-ip">Public IPs</router-link></li> -->
                  <li class="hidden"><router-link to="/routers">Routers</router-link></li>
                  <li v-if="canReadUsers"><router-link to="/users">Users</router-link></li>
                  <li v-if="canReadRoles"><router-link to="/roles">Roles</router-link></li>
                  <li v-if="canReadQuotaPackages" class="hidden"><router-link to="/packages">Packages</router-link></li>
                  <li v-if="canReadProjectGateway"><router-link to="/gateway">Gateway</router-link></li>
                  <li v-if="canReadLoadBalancer"><router-link to="/load-balancers">Load Balancers</router-link></li>
                </ul>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-lg-2 col-md-2 col-sm-2 col-xs-12">
          <div class="user-login pull-right dropdown">
            <a href="#" class="dropdown-toggle active" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
              <img src="@/assets/images/profile-pic.svg" alt="Name"> <i class="fa fa-angle-down" aria-hidden="true"></i>
            </a>
            <ul class="dropdown-menu">
              <li class="hidden"><a href="#">My Profile</a></li>
              <li class="hidden"><a href="#">Edit Profile</a></li>
              <li class="hidden"><a href="#">Status</a></li>
              <li><router-link to="/action-logs">Action Logs</router-link></li>
              <li v-if="canReadQuotaPackages"><router-link to="/packages">Packages</router-link></li>
              <li><router-link to="/logout">Sign Out</router-link></li>
              <!--<li><a href="#" @click="logOut">Sign Out</a></li>-->
            </ul>
          </div>
          <div class="search-form hidden">
            <form action="" role="search">
              <a href="#" class="dropdown-toggle active search-icon" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
                <img src="@/assets/images/icon-search.svg">
              </a>
              <div class="dropdown-menu header-search-box">
                <input value="" class="form-control" name="s" placeholder="Type here...." type="search">
                <input value="Search" type="submit" class="btn">
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
</header>
</template>

<script>
import { mapGetters } from 'vuex'
import * as acl from '@/utils/Acls'

export default {
  methods: {
    logOut () {
      let _this = this
      this.$store.dispatch('auth/logout', { keepSession: false, triggerLogoutEndPoint: true })
        .then(() => {
          _this.$router.push({ name: 'login' })
        })
    }
  },
  computed: {
    ...mapGetters('providers', ['providers']),
    ...mapGetters('projects', ['projects']),
    ...acl
  },
  created () {
  }
}
</script>
