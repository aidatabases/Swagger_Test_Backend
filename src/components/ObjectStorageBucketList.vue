<template>
        <ul class="list-group">
          <li class="list-group-item bucket-item"
              v-for="bucket in buckets"
              :key="bucket['id']"
              @click.prevent="selectBucket(bucket)"
          >{{ bucket.name }}</li>
        </ul>
</template>

<script>
import { mapGetters } from 'vuex'
import { listBuckets } from '../utils/ObjectStorageUtils'

export default {
  name: 'ObjectStorageBucketList',
  computed: {
    ...mapGetters('objectStorage', ['buckets'])
  },
  created () {
    listBuckets()
  },
  methods: {
    selectBucket (bucket) {
      // console.log(bucketId)
      this.$emit('bucketSelected', bucket)
    }
  }
}
</script>

<style scoped>
  .bucket-item { cursor: pointer; font-weight: bold; }
  .bucket-item:hover { background-color: #333333; color: #ffffff; }
</style>
