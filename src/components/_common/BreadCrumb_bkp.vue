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
        <li v-for="(el, index) in crumbs" :key="index">
          <router-link :to="el.to">{{ el.text | capitalize-first-letter }}</router-link>
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
  mixins: [projectProviderMixin],
  data () {
    return {
      time: null
    }
  },
  computed: {
    ...mapGetters('auth', ['user', 'userRoles', 'selectedProject']),
    userRole () {
      let projectId = this.selectedProject
      let selectedProject = _.find(this.userRoles, { 'project_id': projectId })
      return selectedProject.role_permission_group.group_name
    },
    crumbs () {
      let pathArray = this.$route.path.split('/')
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        if (path) {
          breadcrumbArray.push({
            path: path,
            to:
              breadcrumbArray.length > 0
                ? breadcrumbArray[breadcrumbArray.length - 1].to + '/' + path
                : '/' + path,
            // to: (breadcrumbArray[idx - 1]) ? '/' + breadcrumbArray[idx - 1].path + '/' + path : '/' + path,
            text:
              idx < this.$route.matched.length &&
              this.$route.matched[idx].meta.hasOwnProperty('breadCrumb')
                ? this.$route.matched[idx].meta.breadCrumb
                : path
          })
        }
        return breadcrumbArray
      }, [])
      return breadcrumbs.filter(i => !Number.isInteger(parseInt(i.text)))
    }
  },
  methods: {
    showChangeDomain () {
      store.dispatch('auth/showDomainSelectionModal')
    }
  },
  mounted: function () {
    setInterval(
      () => {
        this.time = moment().format('Do MMMM, h:mm:ss a')
      }, 300)
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
