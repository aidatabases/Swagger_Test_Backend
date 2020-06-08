<template>
  <div class="content-box clearfix odd">
    <img src="@/assets/images/icon-server.svg" alt="">
    <div class="content-info">
      <h4>{{ volume.volume_name }}</h4>
      <div class="content-opts">
        <span><unit-filter :size="volume.volume_size" :unit="'GiB'"></unit-filter></span>
        <span> BLOCK</span>
      </div>
    </div>
    <small><img src="@/assets/images/icon-right-arrow.svg" alt=""></small>
  </div>
</template>

<script>
import filter from './_common/Filter'

export default {
  props: {
    'volume': Object
  },
  components: {
    UnitFilter: filter
  }
}
</script>
