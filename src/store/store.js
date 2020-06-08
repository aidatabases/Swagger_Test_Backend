import Vue from 'vue'
import Vuex from 'vuex'
import vuexCache from 'vuex-cache'
import createPersistedState from 'vuex-persistedstate'
// import createLogger from 'vuex/dist/logger'

import auth from './modules/auth'
import providers from './modules/providers'
import projects from './modules/projects'
import organisations from './modules/organisations'
import volumes from './modules/volumes'
import virtualMachines from './modules/virtualMachines'
import userRoles from './modules/userRoles'
import userRoleScopes from './modules/userRoleScopes'
import gateway from './modules/gateway'
import ui from './modules/ui'
import loader from './modules/loader'
import confirmation from './modules/confirmation'
import flavors from './modules/flavors'
import networks from './modules/networks'
import images from './modules/images'
import users from './modules/users'
import securityGroupRules from './modules/securityGroupRules'
import securityGroups from './modules/securityGroups'
import loadBalancers from './modules/loadBalancers'
import serverFarms from './modules/serverFarms'
import resourceStats from './modules/resourceStats'
import audit from './modules/audit'
import scalingGroups from './modules/scalingGroups'
import snapshots from './modules/snapshots'
import backups from './modules/backups'
import publicIPs from './modules/publicIP'
import objectStorage from './modules/objectStorage'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
    auth,
    providers,
    organisations,
    volumes,
    projects,
    virtualMachines,
    userRoles,
    userRoleScopes,
    gateway,
    ui,
    flavors,
    networks,
    images,
    users,
    loader,
    confirmation,
    securityGroupRules,
    securityGroups,
    loadBalancers,
    serverFarms,
    resourceStats,
    audit,
    scalingGroups,
    snapshots,
    backups,
    publicIPs,
    objectStorage
  },
  strict: process.env.NODE_ENV !== 'production',
  // plugins: debug ? [createLogger(), createPersistedState(), vuexCache] : [createPersistedState(), vuexCache]
  plugins: debug ? [createPersistedState(), vuexCache] : [createPersistedState(), vuexCache]
})

export default store
