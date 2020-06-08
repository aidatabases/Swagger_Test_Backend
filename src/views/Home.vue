<template>
  <span></span>
</template>
<script>
export default {
  props: {
    'destination': String
  },
  created () {
    if (this.destination) {
      this.$router.push({ name: this.destination })
    } else {
      // this.$router.push({ name: 'virtual-machines' })
      this.$router.push({ name: 'dashboard' })
    }
  }
}
</script>
