<template>
  <tr>
    <td>
      <span class="snap-title">
        <img src="@/assets/images/icon-loadbalancer.svg" alt="">
        <router-link v-if="loadBalancer.task_id === '' || loadBalancer.task_id == null" :to="`/load-balancers/detail/${loadBalancer.id}`">{{ loadBalancer.name }}</router-link>
        <router-link v-else :to="'#'">{{ loadBalancer.name }}</router-link>
      </span>
    </td>
    <td>
      <div v-if="loadBalancer.task_id === '' || loadBalancer.task_id == null">
        <span class="ip-status c-gray">PRIV</span>
        <span class="snap-status c-yellow"> {{ loadBalancer.lb_device_ip }}</span>
      </div>
      <div v-else class="progress progress-bar-wrapper">
        <div class="progress-bar progress-bar-gray progress-bar-striped active" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">{{ loadBalancer.action }}</div>
      </div>
    </td>
    <td>{{ providerName }}-{{providerLocation}}</td>
    <td>
      <div class="dropdown">
        <button :disabled="isTaskInProcess" class="btn btn-default btn-sm dropdown-toggle" type="button" id="action-dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          Actions <span class="caret"></span>
        </button>
        <ul class="dropdown-menu" aria-labelledby="action-dropdown">
          <li type="button" class="btn btn-link btn-block btn-action">
            <router-link :to="{ name: 'CreateFarm', params: { id: loadBalancer.id }}">
              <i class="fa fa-file-text"></i> Create Farm
            </router-link>
          </li>
          <li type="button" class="btn btn-link btn-block btn-action text-danger" @click.prevent="deleteLoadBalancer"><i class="fa fa-trash"></i> Delete</li>
        </ul>
      </div>
    </td>
  </tr>
</template>

<script>
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import { deleteLoadBalancer } from '../utils/LoadBalancerUtils'
export default {
  props: ['loadBalancer'],
  mixins: [projectProviderMixin],
  computed: {
    isTaskInProcess () {
      return !(this.loadBalancer.task_id === '' || this.loadBalancer.task_id == null)
    }
  },
  methods: {
    deleteLoadBalancer () {
      deleteLoadBalancer(this.loadBalancer.id)
    }
  }
}
</script>
<style scoped>
  .ip-meta .snap-status .c-yellow {
    width: 80px;
    margin-left: 4px;
  }
  .ip-meta .ip-status .c-gray {
    font-size: 11px;
  }
  .progress {
    margin-bottom: 0;
    text-transform: uppercase;
  }
  .text-danger {
    color: #a94442 !important;
  }
</style>
