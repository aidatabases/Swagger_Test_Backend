<template>
  <bootstrap-modal ref="confirmationModal" :need-header="true" :need-footer="true" :size="'small'">
    <div slot="title">
      <h4 class="modal-title">{{title}}</h4>
    </div>
    <div slot="body">
      <div class="form-group">
        <label class="control-label">{{msg}}</label>
      </div>
    </div>
    <div slot="footer">
      <button type="button" class="btn btn-cloud" @click.prevent="confirm">Yes</button>
      <button type="button" class="btn btn-primary" @click.prevent="decline">No</button>
    </div>
  </bootstrap-modal>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import bootstrapModal from 'vue2-bootstrap-modal'

export default {
  name: 'ConfirmationModal',
  components: {
    bootstrapModal: bootstrapModal
  },
  data () {
    return {
      projectId: -1,
      providerId: ''
    }
  },
  computed: {
    ...mapGetters('providers', ['providers']),
    ...mapGetters('confirmation', ['contentId', 'msg', 'title', 'hidden']),
    ...mapGetters('projects', ['projectById']),
    ...mapGetters('ui', ['showconfirmationModal']),
    project () {
      var project = this.projectById(this.projectId)
      if (!project) {
        return {}
      }
      return project
    }
  },
  methods: {
    showModal () {
      this.$refs.confirmationModal.open()
    },

    hideModal () {
      this.$refs.confirmationModal.close()
    },
    confirm () {
      this.hideModal()
      store.dispatch('confirmation/confirm')
    },
    decline () {
      this.hideModal()
      store.dispatch('confirmation/decline')
    }
  },
  created () {
  },
  watch: {
    'contentId': function (cv, pv) {
      this.showModal()
    }
    // 'hidden': function (cv, pv) {
    //   this.hideModal()
    // }
  }
}
</script>
