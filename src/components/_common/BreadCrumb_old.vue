<template>
  <div id="breadcrumb" class="clearfix">
    <ol class="breadcrumb">
      <li><a href="#" @click.prevent="showChangeDomain">{{ organisationName }}</a></li>
      <li><a href="#" @click.prevent="showChangeDomain">{{ projectName }}</a></li>
      <li><a href="#" @click.prevent="showChangeDomain">{{ providerName }}</a></li>
      <!--<li><strong>{{ user.username }}</strong> <span> ({{ user.organisation_project_user_user[0].organisation.org_reg_code }})</span> | <span>{{ time }}</span></li>-->
      <li><strong>{{ user.username }}</strong> <span> ({{ user.organisation_project_user_user[0].organisation.org_reg_code }}) as <strong>{{ userRole.replace('_', ' ') }}</strong> </span></li>
    </ol>
    <div class="clearfix">
      <ul class="site-breadcrumb pull-left">
        <li><router-link to="/">Home</router-link></li>
        <li v-for="el in breadCrumbList" :key="el.name">
          <router-link :to="'/' + el.link_name">{{ bindName(el.name) }}</router-link>
        </li>
      </ul>
      <span class="timer pull-right">
        {{ time }}
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from 'vuex-store'
import projectProviderMixin from '@/components/mixin/ProjectProvider'
import moment from 'moment'
import _ from 'lodash'

export default {
  name: 'BreadCrumb',
  mixins: [projectProviderMixin],
  data () {
    return {
      breadCrumbList: [],
      time: null
    }
  },
  methods: {
    init () {
      return []
    },
    bindName (name) {
      return this.$route.params[name.replace(':', '')] ? this.$route.params[name.replace(':', '')] : name
    },
    showChangeDomain () {
      store.dispatch('auth/showDomainSelectionModal')
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'userRoles', 'selectedProject']),
    userRole () {
      let projectId = this.selectedProject
      let selectedProject = _.find(this.userRoles, { 'project_id': projectId })
      return selectedProject.role_permission_group.group_name
    }
  },
  watch: {
    '$route' () {
      this.breadCrumbList = (this.$route.meta && this.$route.meta.breadcrum) ? this.$route.meta.breadcrum : this.init()
    }
  },
  mounted: function () {
    setInterval(
      () => {
        this.time = moment().format('Do MMMM, h:mm:ss a')
      }, 300)
  },
  created () {
    this.breadCrumbList = (this.$route.meta && this.$route.meta.breadcrum) ? this.$route.meta.breadcrum : this.init()
  }
}
</script>
<style scoped>
  .about-user {
    padding-top: 8px;
    padding-right: 30px;
  }

  .orgprojectprovider{
    background-color: #256390;
    border: none;
    outline: none;
    padding: 4px 5px;
    color: white;
    cursor: pointer;
    border-radius: 5px;
    font-weight: bold;
  }
  #breadcrumb {
    margin-top: 1.5rem;
  }
  .timer {
    color: #ffffff;
    font-weight: 600;
  }
</style>
