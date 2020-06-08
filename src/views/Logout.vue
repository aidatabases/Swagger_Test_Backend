<template>
  <p>Please wait...</p>
</template>

<script>
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
  created () {
    this.logOut()
  }
}
</script>
