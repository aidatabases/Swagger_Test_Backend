<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="snap-table-container user">
        <div class="snap-table-head clearfix">
          <h1>Users List</h1>
          <!--<router-link v-if="canWriteUsers" class="btn btn-cloud" to="/users/create">New User</router-link>-->
        </div>
        <user-list></user-list>
      </div>
    </div>
  </div>
</template>

<script>
import UserList from '@/components/UserList'
// import * as acl from '@/utils/Acls'

export default {
  name: 'Users',
  components: {
    userList: UserList
  }
  // computed: {
  //   ...acl
  // }
}
</script>
