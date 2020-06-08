<template>
  <td>
    <div v-if="pTaskId !== '' && pTaskId !== null" class="progress-bar-wrapper">
      <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
        {{ statusText }}
      </div>
    </div>
    <span v-else :class="['snap-status', statusClass]">{{ statusText }}</span>
  </td>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VolumeStatus',
  props: {
    'pIsAttached': Boolean,
    'pTaskId': String,
    'pActionStatus': String,
    'pVolume': Object
  },
  computed: {
    ...mapGetters('auth', ['selectedProvider', 'selectedProject']),
    statusText () {
      let text = this.pActionStatus
      text = this.hasError ? 'creation error' : text
      return text.toUpperCase()
    },
    statusClass () {
      let statusClass = this.hasError ? 'c-red' : 'c-purple'
      return statusClass
    },
    hasError () {
      return this.pActionStatus === 'error'
    }
  },
  methods: {
    checkError () {
      if (this.hasError) {
        this.$emit('volume-status-error')
      }
    }
  }
}
</script>
