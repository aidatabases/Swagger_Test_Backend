<template>
    <table style="width:100%;" cellspacing="0">
        <thead>
          <tr>
              <th>User Name</th>
              <th>Full Name</th>
              <th>Projects</th>
          </tr>
        </thead>
        <tbody>
            <tr v-for="(user, index) in sortedUsers" :key="index">
                <td>
                    <span class="snap-title">
                        <img v-show="isAdmins[user.id]" src="@/assets/images/icon-admin.svg" alt="">
                        <img v-show="!isAdmins[user.id]" src="@/assets/images/icon-user-green.svg" alt="">
                        {{ user.username }}
                    </span>
                </td>
                <td>{{ fullname(user.first_name, user.middle_name, user.last_name) }}</td>
                <td>
                  <div v-for="(p, index) in userProjects[user.id]" :key='index' class="route-meta green">
                    {{ p }}
                  </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import _ from 'lodash'
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import { getProjectsNames, isOrgAdmin } from '@/utils/UserHelper'
export default {
  name: 'UserList',
  data () {
    return {
      userProjects: {},
      isAdmins: {}
    }
  },
  computed: {
    ...mapGetters('users', ['users', 'userById']),
    sortedUsers () {
      return _.orderBy(this.users, ['updated'], ['desc'])
    }
  },
  methods: {
    init () {
      store.cache.dispatch('users/LIST', {})
        .then(() => {
          this.users.forEach((u) => {
            this.populateDetails(u.id)
          })
        })
    },
    fullname (firstName, middleName, lastName) {
      let fullName = firstName
      if (middleName !== '') {
        fullName += ' ' + middleName
      }
      if (lastName !== '') {
        fullName += ' ' + lastName
      }
      return fullName
    },
    populateDetails (userId) {
      this.userById(userId)
        .then((user) => {
          this.$set(this.userProjects, user.id, getProjectsNames(user))
          this.$set(this.isAdmins, user.id, isOrgAdmin(user))
        })
    }
  },
  created () {
    this.init()
  },
  beforeDestroy () {
    store.cache.delete('users/LIST', {})
  }
}
</script>
