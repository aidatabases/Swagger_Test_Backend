<template>
  <div id="app">
    <confirmation-modal></confirmation-modal>
    <domain-selection-modal></domain-selection-modal>
    <loader></loader>
    <router-view></router-view>
    <notifications group="success"></notifications>
    <notifications group="notification"></notifications>
    <notifications group="warning"></notifications>
    <notifications group="error" :width="500">
      <template slot="body" slot-scope="props">
        <div class="custom-template notification-error">
          <div class="custom-template-icon icon-danger">
            <i class="fa fa-times-circle-o" aria-hidden="true"></i>
          </div>
          <div class="custom-template-content">
            <div class="custom-template-title">
              {{props.item.title}}
            </div>
            <div class="custom-template-text" v-html="props.item.text"></div>
          </div>
          <div class="custom-template-close" @click="props.close">
            <i class="fa fa-times" aria-hidden="true"></i>
          </div>
        </div>
      </template>
    </notifications>
  </div>
</template>

<script>
import Loader from '@/components/Loader'
import ConfirmationModal from '@/views/ConfirmationModal'
import DomainSelectionModal from '@/views/DomainSelectionModal'
export default {
  components: {
    loader: Loader,
    confirmationModal: ConfirmationModal,
    domainSelectionModal: DomainSelectionModal
  }
}
</script>

<style lang="scss">
  @import './assets/scss/base.scss';

  .notification.n-light {
    margin: 10px;
    margin-bottom: 0;
    border-radius: 3px;
    font-size: 13px;
    padding: 10px 20px;
    color: #495061;
    background: #EAF4FE;
    border: 1px solid #D4E8FD;
    .notification-title {
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 10px;
      color: #2589F3;
    }
  }

  .custom-template {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    text-align: left;
    font-size: 13px;
    margin: 5px;
    margin-bottom: 0;
    align-items: center;
    justify-content: center;
    &, & > div {
      box-sizing: border-box;
    }
    border: 1px solid #cccccc;
    .custom-template-icon {
      flex: 0 1 auto;
      font-size: 32px;
      padding: 0 10px;
    }
    .custom-template-close {
      flex: 0 1 auto;
      padding: 0 20px;
      font-size: 16px;
      opacity: 0.2;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
    }
    .custom-template-content {
      padding: 16px 10px;
      flex: 1 0 auto;
      font-weight: 400;
      .custom-template-title {
        letter-spacing: 1px;
        text-transform: uppercase;
        font-size: 10px;
        font-weight: 600;
      }
    }
    .icon-danger { color: #9e1819; }
  }

  .notification-error {
    background: #ff5252;
    .custom-template-content {
      color: #ffffff;
    }
  }
</style>
