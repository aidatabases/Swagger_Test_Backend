import store from 'vuex-store'
import _ from 'lodash'
import mapper from './Mapper'

export class VirtualMachine {
  constructor ({ name = ``, image = ``, flavor = ``, network = '', securityGroups = '', user = '', userData = '', provider = '', project = '', vMUserName = '', vMPassword = '', bootFromVolume = '' } = {}) {
    this.name = name
    this.imageId = image
    this.flavorId = flavor
    this.networkId = network
    this.vmUsername = vMUserName
    this.vmPassword = vMPassword
    this.vmConfirmPassword = vMPassword
    this.securityGroupId = securityGroups
    this.userId = store.getters['auth/userId']
    this.userData = userData
    this.providerId = store.getters['auth/selectedProvider']
    this.projectId = store.getters['auth/selectedProject']
    this.bootFromVolume = bootFromVolume
  }

  toJson () {
    return _.mapKeys(this, (v, k) => {
      return mapper.getMappedKey(_.snakeCase(k))
    })
  }
}

export function createVirtualMachine (data) {
  return Object.freeze(new VirtualMachine(data))
}
