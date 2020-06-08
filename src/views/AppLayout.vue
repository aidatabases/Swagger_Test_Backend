<template>
  <div v-if="isAuthenticated">
    <page-header></page-header>
    <section class="section-row">
      <div class="container">
        <bread-crumb></bread-crumb>
        <transition name="slide" mode="out-in">
          <router-view/>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import PageHeader from '@/components/_common/Header'
import BreadCrumb from '@/components/_common/BreadCrumb'
// import { listVolumes } from '@/utils/VolumesUtil'
export default {
  components: {
    pageHeader: PageHeader,
    breadCrumb: BreadCrumb
  },
  data: function () {
    return {
      isAuthenticated: false
    }
  },
  computed: {
    ...mapGetters('auth', ['myScope', 'token'])
  },
  methods: {
    autoLogout () {
      this.$store.dispatch('auth/logout', { keepSession: false, triggerLogoutEndPoint: true })
    }
  },
  created () {
    window.addEventListener('beforeunload', this.autoLogout)
    this.$store.dispatch('loader/addMessage', { type: 'checking-credentials', msg: 'Please wait while we are authenticating you!' })
    let _this = this
    this.$store.dispatch('auth/checkAuthToken', { token: this.token })
      .then(() => {
        this.$store.dispatch('auth/autoLogin')
          .then(() => {
            store.cache.dispatch('providers/LIST', {})
            store.cache.dispatch('projects/LIST', {})
            store.dispatch('flavors/list', {})
            store.cache.dispatch('images/list', {})
            // listVolumes()
            store.cache.dispatch('securityGroups/list', {})
            store.cache.dispatch('networks/list', {})
          })
          .then(() => {
            _this.isAuthenticated = true
          })
          .finally(() => {
            _this.$store.dispatch('loader/removeMessage', { type: 'checking-credentials' })
          })
      })
      .catch(() => {
        // sending user to login page
        _this.$router.push({ name: 'login' })
      })
  },
  watch: {
    // whenever question changes, this function will run
    token () {
      if (!this.token) {
        this.$router.replace({ path: 'logout' })
        console.log('Session expired. User logged out.')
      }
    }
  }
}
</script>
