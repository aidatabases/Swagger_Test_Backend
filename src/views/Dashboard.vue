<template>
  <div>
    <div class="row">
      <div class="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div class="instance-box add">
          <span class="add-ins"><img src="@/assets/images/icon-add-white.svg" alt=""></span>
          <span>Easily create a new Virtual Machine</span>
          <router-link to="/virtual-machines/create" class="btn btn-warning">Create Virtual Machine</router-link>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <div class="instance-box">
          <h2>User List</h2>
          <div class="notification-content">
            <ul class="list-group">
              <user-list v-for="user in users" :key="user.id" :user="user"></user-list>
            </ul>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 col-xs-12">
        <div class="instance-box">
          <h2>Project List</h2>
          <div class="notification-content">
            <ul class="list-group">
              <project-list v-for="project in projects" :key="project.id" :project="project"></project-list>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="instance-data">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
          <div class="instance-box">
            <h2>Virtual Machines</h2>
            <div class="notification-content">
              <table class="table table-bordered table-striped table-striped" style="background-color: #ffffff;">
                <thead>
                <tr>
                  <th class="col-md-6">Name</th>
                  <th class="col-md-2">PRIVATE IP</th>
                  <th class="col-md-2">Security Rules</th>
                  <th class="col-md-2">Additional Storage</th>
                </tr>
                </thead>
                <tbody>
                <template v-if="virtualMachines.length > 0">
                  <virtual-machine-row v-for="vm in sortedVMs" :key="vm.id" :vm="vm"></virtual-machine-row>
                </template>
                <template v-if="virtualMachines.length < 1">
                  <tr>
                    <td colspan="6">
                      <h3 class="text-center" style="margin: 0; color: #90A4AE;">No virtual machine found</h3>
                    </td>
                  </tr>
                </template>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <resource-limits/>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import UserList from '@/components/DashboardUserListRow'
import ProjectList from '@/components/DashboardProjectListRow'
import ResourceLimits from '../components/DashboardResourceLimits'
import VirtualMachineRow from '../components/DashboardVmListRow'
import _ from 'lodash'

export default {
  components: {
    UserList,
    ProjectList,
    ResourceLimits,
    VirtualMachineRow
  },
  computed: {
    ...mapGetters('users', ['users']),
    ...mapGetters('projects', ['projects']),
    ...mapGetters('virtualMachines', ['virtualMachines']),
    sortedVMs () {
      return _.orderBy(this.virtualMachines, ['id'], ['desc'])
    }
  },
  methods: {
    init () {
      store.dispatch('users/LIST', {})
      store.dispatch('projects/LIST', {})
      store.dispatch('virtualMachines/LIST', {})
    }
  },
  created () {
    this.init()
  }
}
</script>
