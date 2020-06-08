<template>
  <section class="login-container">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <div class="login-content text-center">
            <img src="@/assets/images/logo-emblem.svg" alt="Emblem">
            <div class="logo-grp">
              <a href="#"><img src="@/assets/images/logo-nic.svg"
                               alt="National Informatic Center Logo"></a>
              <a href="#"><img src="@/assets/images/logo-cloud.png" alt="Cloud Logo"></a>
            </div>
            <h1>Welcome! Please Login</h1>
            <div class="separator user"><strong><img src="@/assets/images/icon-user.svg" alt=""></strong>
            </div>
            <form v-if="!isPasswordAuthenticated" method="post" action="/auth/login" name="login" @submit.prevent="loginUser">
              <div  class="form-group clearfix">
                <i class="fa fa-user-o" aria-hidden="true"></i>
                <input class="form-control" autofocus placeholder="E-mail address" type="text" v-model="username" autocomplete="off">
              </div>
              <div class="form-group has-feedback clearfix">
                <i class="fa fa-unlock-alt" aria-hidden="true"></i>
                <input class="form-control" placeholder="Password" :type="passwordFieldType" v-model="password" autocomplete="off">
                <i class="fa form-control-feedback" :class="[isPasswordVisible ? 'fa-eye-slash' : 'fa-eye']" @click="switchPasswordVisibility()"></i>
              </div>
              <input type="submit" value="Log in" class="btn">
            </form>

            <form v-if="isPasswordAuthenticated" method="post" action="/auth/login" name="login" @submit.prevent="validateOtp">
              <div class="alert alert-success" role="alert">
                One-Time Password(OTP) has been sent to your registered mobile number. OTP is valid for 2 minutes.
              </div>
              <div class="form-group clearfix">
                <i class="fa fa-key" aria-hidden="true"></i>
                <input class="form-control" ref='otp' placeholder="Enter OTP" :type="otpFieldType" v-model="otp" autocomplete="off">
                <i class="fa form-control-feedback" :class="[isOtpVisible ? 'fa-eye-slash' : 'fa-eye']" @click="switchOtpVisibility()"></i>
              </div>
              <div class="btn-grp clearfix">
                <input type="submit" value="Validate OTP" class="btn">
                <button v-if="isResendOtpButtonVisible" type="button" @click.prevent="resendOtp()" class="btn">Resend OTP</button>
                <input v-if="!isResendOtpButtonVisible" type="button" v-model="otpResendTime" class="btn otp-timer">
              </div>
            </form>

            <p v-if="!isPasswordAuthenticated">Not registered with us? <a href="https://cloud.gov.in/registration.php">Register Now</a></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import store from '../store/store'
import { mapGetters } from 'vuex'
import axios from 'axios'
import moment from 'moment'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  data () {
    return {
      username: '',
      password: '',
      isPasswordAuthenticated: false,
      isOtpAuthenticated: false,
      otp: '',
      passwordFieldType: 'password',
      isPasswordVisible: false,
      otpFieldType: 'password',
      isOtpVisible: false,
      isResendOtpButtonVisible: false,
      otpResendTime: '00:00'
    }
  },
  mixins: [validationMixin],
  validations: {
    otp: { required }
  },
  computed: {
    ...mapGetters('auth', ['userId', 'token'])
  },
  methods: {
    loginUser: function () {
      let _this = this
      store
        .dispatch('auth/login', this.$data)
        .then(() => {
          _this.isPasswordAuthenticated = true
          if (_this.token) {
            _this.$socket.emit('session', { 'token': _this.token })
            _this.$socket.on(_this.token, (data) => {
              axios.defaults.headers.common = {
                'authorization': 'Bearer ' + _this.token,
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': data.csrf_token
              }
            })
            _this.$socket.emit('join_room', { 'taskId': 'static_room' })
          }
          // Remove previous error notification if any
          this.$notify({
            group: 'error',
            clean: true
          })
        })
    },
    validateOtp () {
      if (this.otp.length === 6) {
        store.dispatch('auth/validateOtp', { otp: this.otp })
          .then(() => {
            // Remove previous error notification if any
            this.$notify({
              group: 'error',
              clean: true
            })
            store.dispatch('auth/showDomainSelectionModal')
          })
      } else {
        let msg = (this.otp.length !== 0) ? 'The OTP entered is incorrect. Please enter correct OTP or try regenerating the OTP.' : 'Please enter a valid OTP.'

        this.$notify({
          group: 'error',
          type: 'error',
          title: 'Error Notification',
          text: msg,
          duration: 20000
        })
      }
    },
    switchPasswordVisibility () {
      this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
    },
    switchOtpVisibility () {
      this.otpFieldType = this.otpFieldType === 'password' ? 'text' : 'password'
    },
    resendOtp () {
      this.isResendOtpButtonVisible = false
      this.resendOtpTimer()
      this.otp = ''
      let _this = this
      store.dispatch('auth/resendOtp')
        .then(() => {
          _this.$notify({
            group: 'success',
            type: 'success',
            title: 'Success Message !!',
            text: 'New OTP sent successfully. Please check your registered mobile or email.',
            duration: 10000
          })
        })
    },
    resendOtpTimer () {
      this.isResendOtpButtonVisible = false
      let _this = this
      let expireTime = moment().add(122, 'seconds')

      let x = setInterval(() => {
        let diff = expireTime.diff(moment())
        if (diff <= 0) {
          clearInterval(x)
          _this.isResendOtpButtonVisible = true
          _this.otpResendTime = '00:00'
        } else {
          _this.otpResendTime = moment.utc(diff).format('mm:ss')
        }
      }, 1000)
    }
  },
  watch: {
    'isPasswordAuthenticated': function (isPasswordAuthenticated) {
      if (isPasswordAuthenticated) {
        this.$nextTick(() => {
          this.$refs.otp.focus()
        })
        this.resendOtpTimer()
      }
    },
    passwordFieldType () {
      this.isPasswordVisible = this.passwordFieldType !== 'password'
    },
    otpFieldType () {
      this.isOtpVisible = this.otpFieldType !== 'password'
    }
  }
}
</script>

<style scoped>
  .fa-eye, .fa-eye-slash { color: #2b2b33; cursor: pointer; pointer-events: all; }
  .otp-timer { border: none !important; background: none !important; text-align: right; cursor: auto !important; }
</style>
