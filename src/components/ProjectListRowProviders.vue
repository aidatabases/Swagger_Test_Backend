<template>
  <td>
    <div v-if="pTaskId != null && pTaskId != ''" class="progress progress-bar-wrapper">
      <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%"></div>
    </div>
    <div v-else v-for="mProvider in pMappedProviders" :key="mProvider.provider_id" class="route-meta green">
      {{ providerDetails[mProvider.provider_id] }}
    </div>
  </td>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: ['pMappedProviders', 'pTaskId'],
  computed: {
    ...mapGetters('providers', ['providerById'])
  },
  data () {
    return {
      providerDetails: {}
    }
  },
  methods: {
    init () {
      this.pMappedProviders.forEach((p) => {
        this.populateProvider(p)
      })
    },
    populateProvider (_provider) {
      this
        .providerById(_provider.provider_id)
        .then((provider) => {
          this.$set(this.providerDetails, provider.id, provider.provider_name + ' (' + provider.provider_location + ')')
        })
    }
  },
  created () {
    this.init()
  }
}
</script>
