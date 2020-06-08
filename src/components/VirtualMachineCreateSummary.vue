<template>
  <div class="status-box">
    <h3>Summary</h3>
    <ul>
      <li><b>Name - </b>{{ pSummary.name }}</li>
      <li><b>UserName - </b>{{ pSummary.vMUserName }}</li>
      <li><b>Image - </b> {{ selectedImageName }}</li>
      <li><b>Flavor - </b> {{ selectedFlavorName }}</li>
    </ul>
    <a class="btn btn-warning" @click="createVm">Launch Instance</a>
    <a class="btn btn-cloud-default" href="#">Cancel</a>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'VirtualMachineCreateSummary',
  props: {
    pSummary: Object
  },

  methods: {
    createVm: function () {
      this.$emit('vm-create')
    },
    ...mapGetters('images', ['imageById']),
    ...mapGetters('flavors', ['flavorById'])
  },
  computed: {
    selectedFlavorName () {
      var flavor = this.flavorById()(this.pSummary.flavor)
      return flavor ? flavor.name : null
    },
    selectedImageName () {
      var image = this.imageById()(this.pSummary.image)
      return image ? image.name : null
    }
  }

}
</script>
