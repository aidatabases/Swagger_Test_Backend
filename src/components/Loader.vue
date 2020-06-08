<template>
  <div v-show="isLoading" class="site-loader">
    <div class="loader-content">
      <img src='@/assets/images/icon-loader.svg'>
      <span>{{ loadingMsg }}</span>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Loader',
  computed: {
    ...mapGetters('loader', [
      'isLoading',
      'loadingMsg'
    ])
  }
}
</script>
