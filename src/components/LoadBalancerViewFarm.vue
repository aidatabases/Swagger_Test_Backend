<template>
  <div class="row">
    <div class="col-xs-12">
      <div class="card" v-if="isDataAvailable">
        <h1>Server Farm Details</h1>
        <div class="row mb-40">
          <div class="col-md-5">
            <h4>Load Balancer farm name</h4>
          </div>
          <div class="col-md-7">
            <div class="form-group">
              <div class="col-sm-12">
                <input readonly type="text" class="form-control" v-model.trim="farmDetails.name">
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-40">
          <div class="col-md-12">
            <h2>Common Settings</h2>
            <div class="card card-bordered">
              <div class="mb-40">
                <h4>Algorithm</h4>
                <div class="form-group ">
                  <div class="radio">
                    <label class="radio-inline">
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="random" :disabled="isSelectedAlgorithm('random')"> Random
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Randomly select a backend'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="round_robin" :disabled="isSelectedAlgorithm('round_robin')"> Round Robin
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend in round-robin fashion'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="least_conn" :disabled="isSelectedAlgorithm('least_conn')"> Least Connections
                      <i class="fa fa-question-circle text-muted" aria-hidden="true" v-tooltip.right="'Select backend with the fewest active connections'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="first" :disabled="isSelectedAlgorithm('first')"> First
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select the first available backend in the order they are defined in the Caddyfile'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="ip_hash" :disabled="isSelectedAlgorithm('ip_hash')"> IP Hash
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend by hashing the request IP, distributing evenly over the hash space based on the total number of backends'"></i>
                    </label>
                    <label>
                      <input type="radio" name="optionsRadios" v-model="farmDetails.balance" value="uri_hash" :disabled="isSelectedAlgorithm('uri_hash')"> URL Hash
                      <i class="fa fa-question-circle" aria-hidden="true" v-tooltip.right="'Select backend by hashing the request URI, distributing evenly over the hash space based on the total number of backends'"></i>
                    </label>
                  </div>
                </div>
              </div>
              <div class="mb-40">
                <h4>Application Bind</h4>
                <div class="row">
                  <div class="col-md-3">
                    <div class="material">
                      <label>IP Address/Host Name</label>
                      <input readonly v-model.trim="farmDetails.bind.split(':')[0]" type="text" placeholder="Enter Host name" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" @click="showAlert('Bind IP Address/Host Name', 'Bind host is the hostname (or IP address) to bind to.')" aria-hidden="true"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material">
                      <label>Port</label>
                      <input readonly v-model.trim="farmDetails.bind.split(':')[1]" type="text" placeholder="Enter Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Bind Port', 'Bind port is the port number to bind to.')"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4>Health Checks</h4>
                <div class="row" id="health-section">
                  <div class="col-md-3">
                    <div class="material">
                      <label>Port</label>
                      <input readonly v-model.trim="farmDetails.health_check_port" type="text" placeholder="Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Health Check Port Number', 'It will use port to perform the health check instead of the port provided for the upstream. This is useful if you use an internal port for debug purposes where your health check endpoint is hidden from public view. This setting is not supported when destination is a service locator.')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material">
                      <label>Path</label>
                      <input readonly v-model.trim="farmDetails.health_check" type="text" placeholder="Check path" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Health Check Path', 'It will use path to check the health of each backend. If a backend returns a status code of 200-399, then that backend is considered healthy. If it doesn’t, the backend is marked as unhealthy for at least health_check_interval and no requests are routed to it. If this option is not provided then health checks are disabled')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material">
                      <label>Check Interval (in s)</label>
                      <input readonly v-model.trim="farmDetails.health_check_interval" type="text" placeholder="Port number" class="form-control"/>
                    </div>
                    <div class="info-icon-xlg">
                      <i class="fa fa-question-circle" aria-hidden="true" @click.prevent="showAlert('Check Interval', 'It specifies the time between each health check on unhealthy backends. The default interval is 30 seconds (30s).')"></i>
                    </div>
                  </div>
                  <div class="col-md-3">
                    <div class="material">
                      <label>Check Timeout (in s)</label>
                      <input readonly v-model.trim="farmDetails.health_check_timeout" type="text" placeholder="Port number" class="form-control"/>
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
                  <div class="material">
                    <label>Max Connections</label>
                    <input readonly type="text" class="form-control" placeholder="Max no of connections" v-model="farmDetails.max_connections">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Max Connections', 'The maximum number of concurrent requests to each backend. 0 means no limit. When the limit is reached, additional requests will fail with Bad Gateway (502). Default is 0.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Fail Timeout</label>
                    <input readonly type="text" class="form-control" placeholder="Enter fail timeout" v-model.trim="farmDetails.fail_timeout">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Fail Timeout', 'It specifies how long to remember a failed request to a backend. A timeout > 0 enables request failure counting and is required for load balancing between backends in case of failures. If the number of failed requests accumulates to the max_fails value, the host will be considered down and no requests will be routed to it until failed requests begin to be forgotten. By default, this is disabled (0s), meaning that failed requests will not be remembered and the backend will always be considered available. Must be a duration value (like “10s” or “1m”).')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Max Fails</label>
                    <input readonly type="text" class="form-control" placeholder="Enter maximum fails" v-model.trim="farmDetails.max_fails">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Max Fails', 'The number of failed requests within fail_timeout that are needed before considering a backend to be down. Not used if fail_timeout is 0. Must be at least 1. <strong>Default is 1</strong>.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Try Duration</label>
                    <input readonly type="text" class="form-control" v-model.trim="farmDetails.try_duration">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Try Duration', 'The maximum number of concurrent requests to each backend. 0 means no limit. When the limit is reached, additional requests will fail with Bad Gateway (502). <strong>Default is 0</strong>.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Try Interval</label>
                    <input readonly type="text" class="form-control" v-model.trim="farmDetails.try_interval">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Try Interval', 'How long to try selecting available upstream hosts for each request. By default, this retry is <strong>disabled (“0s”)</strong>. Clients may hang for this long while the proxy tries to find an available upstream host. This value is only used if a request to the initially-selected upstream host fails.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Keep Live</label>
                    <input readonly type="text" class="form-control" v-model.trim="farmDetails.keepalive">
                  </div>
                  <div class="info-icon-xlg">
                    <i class="fa fa-question-circle" aria-hidden="true" @click="showAlert('Keep Live', 'The maximum number of idle connections to keep open to the backend. <strong>Enabled by default; set to 0 to disable keepalives</strong>. Set to a higher value on busy servers that are properly tuned.')"></i>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="material">
                    <label>Timeout</label>
                    <input readonly type="text" class="form-control" v-model.trim="farmDetails.timeout">
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
            <p class="text-muted">The destination endpoint to loadbalance.</p>
            <div class="card card-bordered">
              <div class="row" v-for="(item, index) in privateIpList" :key="index">
                <div class="col-md-3">
                  <div class="material">
                    <label>IP Address</label>
                    <input type="text" class="form-control" :value="item.split(':')[0]" readonly>
                  </div>
                </div>
                <div class="col-md-2">
                  <div class="material">
                    <label>Port</label>
                    <input type="text" class="form-control" :value="item.split(':')[1]" readonly>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="card">
        <h1>No details found</h1>
      </div>
    </div>
  </div>
</template>

<script>
import { getOne } from '../utils/ServerFarmUtils'
import _ from 'lodash'

export default {
  data () {
    return {
      farmDetails: []
    }
  },
  computed: {
    isDataAvailable () {
      let _this = this
      return !_.isEmpty(_this.farmDetails)
    },
    privateIpList () {
      let _this = this
      let ipList = []
      if (!_.isEmpty(_this.farmDetails.backend_list)) {
        debugger
        ipList = this.farmDetails.backend_list.split(' ')
      }
      return ipList
    }
  },
  methods: {
    isSelectedAlgorithm (algorithm) {
      return !(this.farmDetails.balance === algorithm && this.farmDetails.balance)
    },
    showAlert (title, message, errorType = '') {
      this.$swal({
        type: errorType,
        title: title,
        html: message
      })
    }
  },
  mounted () {
    const farmId = this.$route.params.farmId
    getOne(farmId).then(res => {
      this.farmDetails = res
    })
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
