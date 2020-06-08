<template>
  <tr>
    <td>
      <router-link :to="'/load-balancers/view-farm/' + sf.id">{{ sf.name }}</router-link>
    </td>
    <td>
      <ul>
        <li v-for="ip in backendList" :key="ip">{{ ip }}</li>
      </ul>
    </td>
    <td>{{ sf.updated }}</td>
    <td>
      <span v-if="sf.status === 'paused'" class="snap-status c-purple">{{ sf.status }}</span>
      <span v-if="sf.status === 'running'" class="snap-status c-green">{{ sf.status }}</span>
    </td>
    <td>
      <div class="btn-group">
        <div class="btn-group" role="group">
          <!--v-if="sf.status === 'SHUTOFF'"-->
          <button v-if="sf.status === 'paused'" type="button" class="btn btn-default"  @click.prevent="unPauseSf"><i class="fa fa-play"></i></button>
          <button v-if="sf.status === 'running'" type="button" class="btn btn-default" @click.prevent="pauseSf"><i class="fa fa-pause"></i></button>
          <button type="button" class="btn btn-default" @click.prevent="removeSf"><i class="fa fa-trash"></i></button>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { action } from '../utils/ServerFarmUtils'
export default {
  props: ['sf'],
  computed: {
    backendList () {
      return this.sf.backend_list.split(' ')
    }
  },
  methods: {
    unPauseSf () {
      action(this.sf.load_balancer_id, this.sf.id, 'unpause')
    },
    pauseSf () {
      action(this.sf.load_balancer_id, this.sf.id, 'pause')
    },
    removeSf () {
      action(this.sf.load_balancer_id, this.sf.id, 'remove')
    }
  }
}
</script>
