<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container">
        <div class="snap-table-head clearfix">
          <h1>Audit Trails</h1>
        </div>
        <table style="width:100%;" cellspacing="0">
          <thead>
          <tr>
            <th>#</th>
            <th>Timestamp</th>
            <th>IP</th>
            <th>Message</th>
            <th>Action Type</th>
          </tr>
          </thead>
          <tbody>
            <audit-logs-list-row v-for="(log, index) in logs" :key="log.id" :pLog="log" :index="index"></audit-logs-list-row>
            <tr>
              <td colspan="5" class="loader-row">
                <div v-show="isLoadingData" id="page-loader-block" class="col-xs-12 text-center">
                  <img src="@/assets/images/icon-oval.svg" /> <span>Please wait while we are Loading logs for You !!</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import AuditLogsListRow from '@/components/AuditLogsListRow'
export default {
  data () {
    return {
      logs: [],
      offset: 0,
      limit: 50,
      recordId: 0,
      isLoadingData: true
    }
  },
  computed: {
    ...mapGetters('auth', ['userId'])
  },
  components: {
    auditLogsListRow: AuditLogsListRow
  },
  methods: {
    loadData () {
      // if (this.isLoadingData) {
      //   console.log('Data is still loading returning from here')
      //   return false
      // }
      this.init()
    },
    init () {
      this.isLoadingData = true
      store.cache.dispatch('audit/list', { 'userId': this.userId, 'limit': this.limit, 'recordId': this.recordId })
        .then(res => {
          let _this = this
          let minRecordId = res.reduce((min, p) => p.id < min ? p.id : min, res[0].id)
          if (_this.recordId === 0 || _this.recordId > minRecordId) {
            _this.logs = _this.logs.concat(res)
            _this.recordId = minRecordId
          }
          this.isLoadingData = false
        })
    },
    scrollListner () {
      if (this.bottomVisible()) {
        this.loadData()
      }
    },
    bottomVisible () {
      const scrollY = window.scrollY
      const visible = document.documentElement.clientHeight
      const pageHeight = document.documentElement.scrollHeight
      const bottomOfPage = visible + scrollY >= pageHeight
      return bottomOfPage || pageHeight < visible
    }
  },
  created () {
    window.addEventListener('scroll', this.scrollListner)
    this.init()
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.scrollListner)
  }
}
</script>

<style>
  .loader-row { padding: 2px; }
  #page-loader-block { background: #2e4496; opacity: 0.5; padding: 8px; }
  #page-loader-block>img { height: 16px; margin-bottom: 2px; }
  #page-loader-block>span { color:#fff; font-size: 16px; margin-left: 5px; }
  .section-row .snap-table-container table tbody tr td:first-child {
    width: 5%;
  }
</style>
