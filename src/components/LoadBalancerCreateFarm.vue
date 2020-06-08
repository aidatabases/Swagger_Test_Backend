<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="card">
        <h1>Create Server Farm</h1>
        <div class="row mb-40">
          <div class="col-md-5">
            <h4>Enter Load Balancer farm name</h4>
            <p>Load Balancer Farm name must be unique and contains alphanumeric characters, dashes and periods only.</p>
          </div>
          <div class="col-md-7">
            <div class="form-group" :class="{ 'has-error': $v.formData.name.$dirty && $v.formData.name.$error }">
              <div class="col-sm-12">
                <input type="text" class="form-control" v-model.trim="formData.name">
                <span class="help-block" v-if="$v.formData.name.$dirty && !$v.formData.name.required">Please enter a valid name</span>
                <span class="help-block" v-else-if="$v.formData.name.$dirty && !$v.formData.name.minLength">Name must be minimum 4 characters long.</span>
                <span class="help-block" v-else-if="$v.formData.name.$dirty && !$v.formData.name.maxLength">Name should not exceed 32 characters.</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-40">
          <div class="col-md-12">
            <h2>Common Settings</h2>
            <p class="text-muted">The most common used settings are selected by default. You can change them at any time.</p>
            <div class="card card-bordered">
              <div class="mb-40">
                <h4>Algorithm</h4>
                <div class="form-group ">
                  <div class="radio">
                    <label class="radio-inline">
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="random" checked> Random
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Randomly select a backend'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="round_robin"> Round Robin
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend in round-robin fashion'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="least_conn"> Least Connections
                      <i class="fa fa-question-circle text-muted" aria-hidden="true" v-tooltip.right="'Select backend with the fewest active connections'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="first"> First
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select the first available backend in the order they are defined in the Caddyfile'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="ip_hash"> IP Hash
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend by hashing the request IP, distributing evenly over the hash space based on the total number of backends'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="formData.balance" value="uri_hash"> URL Hash
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend by hashing the request URI, distributing evenly over the hash space based on the total number of backends'"></i>
                    </label>
                  </div>
                </div>
              </div>
              <div class="mb-40">
                <h4>Application Bind</h4>
                <div class="row">
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.bind_host.$dirty && $v.formData.bind_host.$error }">
                      <label>IP Address/Host Name</label>
                      <input v-model.trim="formData.bind_host" type="text" placeholder="Enter Host name" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" @click="showAlert('Bind IP Address/Host Name', 'Bind host is the hostname (or IP address) to bind to.')" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.bind_port.$dirty && $v.formData.bind_port.$error }">
                      <label>Port</label>
                      <input v-model.trim="formData.bind_port" type="text" placeholder="Enter Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Bind Port', 'Bind port is the port number to bind to.')"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>Health Checks</h4>
                <p class="text-muted">Set how often the Load Balancer checks if Virtual Machine instance are responding. It will automatically stop sending traffic to unresponsive instance.</p>
                <div class="row" id="health-section">
                  <!--<div class="col-md-3">
                    <div class="material">
                      <label>Protocol</label>
                      <select name="" class="form-control" disabled>
                        <option value="http" selected>HTTP</option>
                      </select>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="''"></i>
                    </div>
                  </div>-->
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.health_check_port.$dirty && $v.formData.health_check_port.$error }">
                      <label>Port</label>
                      <input v-model.trim="formData.health_check_port" type="text" placeholder="Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Health Check Port Number', 'It will use port to perform the health check instead of the port provided for the upstream. This is useful if you use an internal port for debug purposes where your health check endpoint is hidden from public view. This setting is not supported when destination is a service locator.')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.health_check.$dirty && $v.formData.health_check.$error }">
                      <label>Path</label>
                      <input v-model.trim="formData.health_check" type="text" placeholder="Check path" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Health Check Path', 'It will use path to check the health of each backend. If a backend returns a status code of 200-399, then that backend is considered healthy. If it doesn’t, the backend is marked as unhealthy for at least health_check_interval and no requests are routed to it. If this option is not provided then health checks are disabled')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.health_check_interval.$dirty && $v.formData.health_check_interval.$error }">
                      <label>Check Interval (in s)</label>
                      <input v-model.trim="formData.health_check_interval" type="text" placeholder="Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click.prevent="showAlert('Check Interval', 'It specifies the time between each health check on unhealthy backends. The default interval is 30 seconds (30s).')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material" :class="{ 'has-error': $v.formData.health_check_timeout.$dirty && $v.formData.health_check_timeout.$error }">
                      <label>Check Timeout (in s)</label>
                      <input v-model.trim="formData.health_check_timeout" type="text" placeholder="Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Check Timeout', 'It sets a deadline for health check requests. If a health check does not respond within health_check_timeout, the health check is considered failed. The default is 60 seconds (60s).')"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-40">
          <div class="col-md-12">
            <h2>Advance Settings</h2>
            <p class="text-muted">Advance settings</p>
            <div class="card card-bordered">
              <div class="row">
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.max_connections.$dirty && $v.formData.max_connections.$error }">
                    <label>Max Connections</label>
                    <input type="text" class="form-control" placeholder="Max no of connections" v-model="formData.max_connections">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Max Connections', 'The maximum number of concurrent requests to each backend. 0 means no limit. When the limit is reached, additional requests will fail with Bad Gateway (502). Default is 0.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.fail_timeout.$dirty && $v.formData.fail_timeout.$error }">
                    <label>Fail Timeout</label>
                    <input type="text" class="form-control" placeholder="Enter fail timeout" v-model.trim="formData.fail_timeout">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Fail Timeout', 'It specifies how long to remember a failed request to a backend. A timeout > 0 enables request failure counting and is required for load balancing between backends in case of failures. If the number of failed requests accumulates to the max_fails value, the host will be considered down and no requests will be routed to it until failed requests begin to be forgotten. By default, this is disabled (0s), meaning that failed requests will not be remembered and the backend will always be considered available. Must be a duration value (like “10s” or “1m”).')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.max_fails.$dirty && $v.formData.max_fails.$error }">
                    <label>Max Fails</label>
                    <input type="text" class="form-control" placeholder="Enter maximum fails" v-model.trim="formData.max_fails">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Max Fails', 'The number of failed requests within fail_timeout that are needed before considering a backend to be down. Not used if fail_timeout is 0. Must be at least 1. <strong>Default is 1</strong>.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.try_duration.$dirty && $v.formData.try_duration.$error }">
                    <label>Try Duration</label>
                    <input type="text" class="form-control" v-model.trim="formData.try_duration">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Try Duration', 'The maximum number of concurrent requests to each backend. 0 means no limit. When the limit is reached, additional requests will fail with Bad Gateway (502). <strong>Default is 0</strong>.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.try_interval.$dirty && $v.formData.try_interval.$error }">
                    <label>Try Interval</label>
                    <input type="text" class="form-control" v-model.trim="formData.try_interval">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Try Interval', 'How long to try selecting available upstream hosts for each request. By default, this retry is <strong>disabled (“0s”)</strong>. Clients may hang for this long while the proxy tries to find an available upstream host. This value is only used if a request to the initially-selected upstream host fails.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.keepalive.$dirty && $v.formData.keepalive.$error }">
                    <label>Keep Live</label>
                    <input type="text" class="form-control" v-model.trim="formData.keepalive">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Keep Live', 'The maximum number of idle connections to keep open to the backend. <strong>Enabled by default; set to 0 to disable keepalives</strong>. Set to a higher value on busy servers that are properly tuned.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material" :class="{ 'has-error': $v.formData.timeout.$dirty && $v.formData.timeout.$error }">
                    <label>Timeout</label>
                    <input type="text" class="form-control" v-model.trim="formData.timeout">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Timeout', 'The duration before timing out the connection to upstream; <strong>default is 30s</strong>.')"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row bm-40">
          <div class="col-md-12">
            <h2>Server Settings</h2>
            <p class="text-muted">Server settings</p>
            <div class="card card-bordered" :class="{ 'has-error': $v.privateIpList.$dirty && $v.privateIpList.$error }">
              <div class="row" :class="{ 'mb-40' : privateIpList.length > 0 }">
                <div class="col-md-9">
                  <p>The destination endpoint to loadbalance to. At least one is required, but multiple may be specified separated by space (192.168.3.10:80 192.168.3.11:80)</p>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-warning" @click.prevent="showModal()">Add Endpoint</button>
                </div>
              </div>
              <div class="row" v-for="(item, index) in privateIpList" :key="index">
                <div class="col-md-3">
                  <div class="material">
                    <label>IP Address</label>
                    <input type="text" class="form-control" :value="item.ip" readonly>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="material">
                    <label>Port</label>
                    <input type="text" class="form-control" :value="item.port" readonly>
                  </div>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-md btn-danger" @click="removeBackendIp(index)"> <i class="fa fa-trash"></i> Remove</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button type="button" class="btn btn-warning btn-create my-20" @click.prevent="create">Create Load Balancer</button>
        </div>
      </div>
      <backend-list-modal :p-show="showbackendListModal" :vms="virtualMachines" @backendIpSelected="selectBackendIp($event)"></backend-list-modal>
    </div>
  </div>
</template>

<script>
import store from 'vuex-store'
import { mapGetters } from 'vuex'
import BackendListModal from '@/components/LoadBalancerCreateFarmBackendModal'
import { validationMixin } from 'vuelidate'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
import { name } from '../lib/vuelidate/CustomValidations'

export default {
  mixins: [validationMixin],
  data () {
    return {
      formData: {
        name: '',
        bind: null,
        bind_host: '0.0.0.0',
        bind_port: '80',
        max_connections: '0',
        balance: 'random',
        fail_timeout: '0s',
        max_fails: '1',
        try_duration: '0',
        try_interval: '0s',
        health_check: '/',
        health_check_port: '80',
        health_check_interval: '30s',
        health_check_timeout: '60s',
        keepalive: '0',
        timeout: '30s',
        backend_list: [],
        provider_id: null,
        project_id: null,
        load_balancer_id: this.$route.params.id
      },
      showbackendListModal: -1,
      privateIpList: []
    }
  },
  validations: {
    formData: {
      name: { name, required, minLength: minLength(4), maxLength: maxLength(32) },
      bind_host: { required },
      bind_port: { required },
      max_connections: { required },
      balance: { required },
      fail_timeout: { required },
      max_fails: { required },
      try_duration: { required },
      try_interval: { required },
      health_check: { required },
      health_check_port: { required },
      health_check_interval: { required },
      health_check_timeout: { required },
      keepalive: { required },
      timeout: { required }
    },
    privateIpList: { required }
  },
  computed: {
    ...mapGetters('auth', ['selectedProject']),
    ...mapGetters('auth', ['selectedProvider']),
    ...mapGetters('virtualMachines', ['virtualMachines'])
  },
  components: {
    backendListModal: BackendListModal
  },
  methods: {
    create () {
      this.$v.$touch()
      if (this.$v.$anyError) {
        this.showAlert('Error', 'Please fix all highlighted fields.', 'error')
        return
      }
      this.formData.provider_id = this.selectedProvider
      this.formData.project_id = this.selectedProject
      this.formData.backend_list = this.privateIpList.map(i => { return i.ip + ':' + i.port }).join(' ')
      this.formData.bind = this.formData.bind_host + ':' + this.formData.bind_port

      store
        .dispatch('serverFarms/create', {
          'providerId': this.formData.provider_id,
          'projectId': this.formData.project_id,
          'lbId': this.formData.load_balancer_id,
          'payload': this.formData
        })
        .then(res => {
          this.$router.push({ path: '/load-balancers/detail/' + this.$route.params.id })
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {})
    },
    selectBackendIp (data) {
      this.privateIpList.push(data)
    },
    removeBackendIp (index) {
      this.privateIpList.splice(index, 1)
    },
    showModal () {
      this.showbackendListModal = Math.floor(Math.random() * Math.floor(100))
    },
    showAlert (title, message, errorType = '') {
      this.$swal({
        type: errorType,
        title: title,
        html: message
      })
    }
  }
}
</script>

<style scoped>
  .btn.btn-rm{
    background-color: #ff2d55 !important;
    border-color: #ff2d55 !important;
    color: #ffffff !important;
  }
  .help-inline-block {
    display: inline-block !important;
    margin-left: 20px;
  }
  .radio label { margin-right: 40px; }
  .material {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 8px 8px 0 8px;
    width: 85%;
    margin-bottom: 10px;
  }
  .material label {
    color: #aeb0ab;
    margin: 0 5px 0;
  }
  .material select, .material input {
    border: none !important;
    font-weight: bolder !important;
    background: #ffffff;
    padding: 6px;
    height: 32px;
  }
  .info-icon-xlg {
    font-size: 30px;
    color: #ccc;
    padding: 0 0 0 8px;
    position: absolute;
    right: 16px;
    bottom: 0;
    cursor: pointer;
  }
  .btn-create {
    padding: 10px 120px;
    font-size: 18px;
    text-transform: uppercase;
  }

  .radio input[type="radio"]{
    cursor: pointer;
  }

  .has-error {
    border-color: #a94442 !important;
  }
  .material .form-control:focus {
    box-shadow: none;
  }

</style>
