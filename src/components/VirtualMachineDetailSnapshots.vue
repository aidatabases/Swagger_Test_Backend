<template>
  <div class="col-xs-9">
    <div class="snap-table-container">
      <div>
        <div class="snap-table-head clearfix">
          <h2>Take Snapshot</h2>
        </div>
        <div class="snap-table-body">
          <p class="text-info"><strong>We recommend turning off your Virtual Machine before taking a snapshot to ensure data consistency.</strong></p>
          <div class="row">
            <div class="col-sm-8" :class="{ 'has-error': $v.snapshotName.$dirty && $v.snapshotName.$error }">
              <input v-model="snapshotName" type="text" class="form-control" :disabled="isAnyProcessOngoing" placeholder="Enter snapshot name">
              <span class="help-block" v-if="$v.snapshotName.$dirty && !$v.snapshotName.required">Please enter a name</span>
              <span class="help-block" v-if="$v.snapshotName.$dirty && !$v.snapshotName.minLength">Minimum four characters required</span>
            </div>
            <div class="col-sm-4">
              <button type="button" class="btn btn-lg btn-cloud btn-block" :disabled="isAnyProcessOngoing" @click.prevent="createSnapshot()">Take snapshot</button>
            </div>
          </div>
        </div>
      </div>
      <hr>
      <div>
        <div class="snap-table-head clearfix">
          <h2>Snapshots</h2>
        </div>
        <table v-if="snapshots.length > 0" style="width:100%;" cellspacing="0">
          <thead>
          <tr>
            <th>Name</th>
            <!--<th>Attached To</th>-->
            <th>Status</th>
            <th>Create Date</th>
            <th>Is Image</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          <template>
            <tr v-for="snapshot in snapshots" :key="snapshot.id">
              <!--<td>{{ snapshot['snapshot_name'] }}</td>-->
              <td>
                <div class="content-box clearfix odd vm-item">
                  <img :src="getOsImgUrl(snapshot['compute']['image']['os'])" alt="">
                  <div class="content-info">
                    <h4>{{ snapshot['snapshot_name'] }}</h4>
                    <!--<div class="content-opts">
                      <span>{{ vm.flavor.vcpus }} vCPU</span>
                      <span>{{ vm.flavor.ram / 1024 }} GiB RAM</span>
                      <span>{{ vm.flavor.disk }} GiB BLOCK</span>
                      <v-popover>
                        <span class="fa fa-info-circle"></span>
                        <template slot="popover">
                          <span v-if="taskId">{{ 'TASK_ID - ' + taskId }}</span>
                          <span v-else>Task ID not available</span>
                        </template>
                      </v-popover>
                    </div>-->
                  </div>
                </div>
              </td>
              <td>
                <div v-if="snapshot['task_id']" class="progress-bar-wrapper">
                  <div class="progress-bar progress-bar-gray progress-bar-striped active text-uppercase" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">
                    {{ snapshot['action'] }}
                  </div>
                </div>
                <span v-else :class="['snap-status', statusClass]">{{ snapshot['action'] }}</span>
              </td>
              <td>{{ snapshot['created'] | timestamp-to-readable }}</td>
              <td><span :class="[ snapshot['is_image'] ? 'c-green' : 'c-gray', 'snap-status' ]">{{ snapshot['is_image'] }}</span></td>
              <td>
                <div class="btn-group" role="group" aria-label="Actions">
                  <button type="button" class="btn btn-default" :disabled="!!snapshot['is_image'] || !!snapshot['task_id']" @click.stop="convertToImage(snapshot['id'])"><i class="fa fa-save" aria-hidden="true"></i></button>
                  <button type="button" class="btn btn-default" :disabled="!!snapshot['task_id']" @click.stop="deleteSnapshot(snapshot['id'])"><i class="fa fa-trash" aria-hidden="true"></i></button>
                </div>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
        <div v-else class="snap-table-body">
          <p class="text-center text-muted">You currently don't have any snapshots of this Virtual Machine.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { listSnapshotsByComputeId, deleteSnapshot, convertToImage } from '@/utils/SnapshotUtil'
import { getOne } from '@/utils/VirtualMachinesUtil'
import { mapGetters } from 'vuex'
import { getOsImgUrl } from '@/utils/Utils'
import _ from 'lodash'
import store from 'vuex-store'
import { required, minLength } from 'vuelidate/lib/validators'

export default {
  name: 'VirtualMachineDetailSnapshots',
  props: ['computeId'],
  data () {
    return {
      snapshotName: '',
      selectedCompute: {},
      snapshots: []
    }
  },
  mixins: [validationMixin],

  computed: {
    ...mapGetters('virtualMachines', ['virtualMachines']),
    statusClass () {
      return this.hasError ? 'c-red' : 'c-purple'
    },
    hasError () {
      // return this.snapshots.action.includes('error')
      return false
    },
    isAnyProcessOngoing () {
      let _this = this
      let results = _.filter(_this.snapshots, function (i) {
        return i.task_id !== ''
      })
      return (results.length > 0)
    }
  },
  validations: {
    snapshotName: { required, minLength: minLength(4) }
  },
  methods: {
    getOsImgUrl,
    init () {
      let _this = this
      getOne(this.computeId)
        .then((selectedCompute) => {
          _this.selectedCompute = selectedCompute
        })
      listSnapshotsByComputeId(this.computeId)
        .then((snapshots) => {
          _this.snapshots = snapshots
        })
    },
    createSnapshot () {
      this.$v.snapshotName.$touch()

      if (this.$v.$anyError) {
        return false
      }

      let _this = this
      store.dispatch('confirmation/showConfirmation', { title: 'Confirmation', msg: 'Are you sure you want to create snapshot?' })
        .then(() => {
          _this.$store.dispatch('virtualMachines/CREATE_SNAPSHOT', { 'computeId': this.computeId, 'snapshotName': this.snapshotName })
            .then(() => {
              this.snapshotName = ''
              listSnapshotsByComputeId(this.computeId)
                .then((snapshots) => {
                  _this.snapshots = snapshots
                })
              _this.$v.$reset()
            })
        })
    },
    deleteSnapshot (snapshotId) {
      deleteSnapshot(this.computeId, snapshotId)
    },
    convertToImage (snapshotId) {
      store.dispatch('confirmation/showConfirmation', { title: 'Confirmation', msg: 'Are you sure you want to convert this snapshot into an image?' })
        .then((cnf) => {
          convertToImage(this.computeId, snapshotId)
        })
    }
  },
  created () {
    this.init()
  }
}
</script>

<style scoped>
  .snap-table-body { margin-left: 20px; margin-right: 20px; padding-bottom: 20px; }
</style>
