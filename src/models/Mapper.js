import _ from 'lodash'

export default {
  'map': {
    'security_group_id': 'sec_group_id',
    'name': 'instance_name'
  },

  'getMappedKey': function (key) {
    if (_.hasIn(this.map, key)) {
      return this.map[key]
    }
    return key
  }
}
