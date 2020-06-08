<template>
    <div class="row">
        <div class="col-xs-12">
            <div class="snap-table-container router">
                <div class="snap-table-head clearfix">
                    <h1>Routers</h1>
                    <router-link class="btn btn-cloud" to="/routers/create">Create Router</router-link>
                </div>
                <table style="width:100%;" cellspacing="0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Interfaces</th>
                            <th>Static Routes</th>
                            <th>External Network</th>
                            <th>Admin State</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><span class="snap-title"><img src="@/assets/images/icon-router.png" alt=""> router 1</span></td>
                        <td>
                            <div class="route-meta green"> <strong>subnet1</strong> 192.168.1.1</div>
                            <div class="route-meta red"> <strong>alpha</strong> 10.7.1.23</div>
                        </td>
                        <td>
                            <div class="route-ip"> 10.7.1.10/16 <small><img src="@/assets/images/icon-right-arrow.svg" alt=""></small> 192.168.1.10</div>
                            <div class="route-ip"> 10.7.1.10/16 <small><img src="@/assets/images/icon-right-arrow.svg" alt=""></small> 192.168.1.12</div>
                        </td>
                        <td>
                            <div class="select-option">
                                <select class="form-control">
                                    <option>ext-1</option>
                                    <option>ext-2</option>
                                    <option>ext-3</option>
                                    <option>ext-4</option>
                                    <option>ext-5</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <label class="switch">
                                <input checked="" type="checkbox">
                                <span class="switch-round"></span>
                            </label>
                        </td>
                        <td><span class="snap-status btn-cloud">Active</span></td>
                        <td>
                            <div class="btn-group">
                                <a href="#"><img src="@/assets/images/icon-router-1.png" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-router-2.png" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-router-3.png" alt=""></a>
                                <a href="#"><img src="@/assets/images/icon-router-4.png" alt=""></a>
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
import RouterList from '@/components/UserList'
export default {
  name: 'Routers',
  components: {
    routerList: RouterList
  },
  methods: {
    createUser () {
      this.$router.replace('/routers/create')
    }
  }
}
</script>
