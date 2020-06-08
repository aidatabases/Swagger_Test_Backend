import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Notifications from 'vue-notification'
import VTooltip from 'v-tooltip'
import moment from 'moment'
import { socket } from '@/utils/Socket'
import VueSweetalert2 from 'vue-sweetalert2'

Vue.config.productionTip = false

axios.defaults.baseURL = process.env.VUE_APP_API_URL + '/api/v1/'

Vue.use(Notifications)
Vue.use(VTooltip)
Vue.use(VueSweetalert2)

Vue.filter('mb-to-readable', function (value) {
  var computeValue = 0
  if (!value) {
    return ''
  }
  computeValue = parseInt(value) / 1024
  if (computeValue >= 1) {
    return computeValue
  }
  return `${value} MiB`
})

Vue.filter('timestamp-to-readable', function (value) {
  if (!value) {
    return ''
  }
  return moment.unix(value).format('DD-MMM-YYYY (hh:mm:ss a)')
})

Vue.filter('lowercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toLowerCase()
})

Vue.filter('capitalize-first-letter', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toLowerCase()
    .replace('-', ' ')
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ')
})

Vue.filter('uppercase', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.toUpperCase()
})

function errorResponseHandler (err) {
  let response = err['response']
  if (response && response['status'] && response['status'] === 401) {
    store.dispatch('auth/logout', { keepSession: false, triggerLogoutEndPoint: false })
  }
  let errorMessage = ''
  if (response['data']['message']) {
    errorMessage = response['data']['message']
  } else if (response['data']['error_description']) {
    errorMessage = response['data']['error_description']
  }
  if (response && response['data'] && errorMessage) {
    vueInstance.$notify({
      group: 'error',
      type: 'warn',
      title: 'Error Notification !!',
      text: errorMessage,
      duration: 10000
    })
  }
  throw err
}

// apply interceptor on response
axios.interceptors.response.use(
  response => response,
  errorResponseHandler
)

// need to remove this
Vue.prototype.$socket = socket

var vueInstance = new Vue({
  router,
  store,
  render: h => {
    return h(App)
  }
}).$mount('#app')
// initializing socket variable to null
// vueInstance.$socket = null

export default vueInstance
