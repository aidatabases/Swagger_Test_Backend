<template>
  <span v-html="formatedData"></span>
</template>

<script>
export default {
  name: 'Filters',
  props: ['size', 'unit', 'showDefault'],
  computed: {
    // convertedValue () {
    //   let computeSize = this.size
    //   if (this.format === 'GB') {
    //     computeSize = parseInt(computeSize) / 1024
    //   }
    //   return computeSize
    // },
    formatedData () {
      if (this.size && this.unit === 'GiB') {
        let equivalentValue = Math.round(this.size * 1.073741824 * 100) / 100
        return this.size + ' <abbr title="' + this.size + ' GiB = ~' + equivalentValue + ' GB">GiB</abbr>'
      } else if (this.size && this.unit === 'GB') {
        return parseInt(this.size) / 1024 + ' GB'
      } else {
        return '<abbr title="1 GiB = ~1.074 GB">GiB</abbr>'
      }
    }
  }
}
</script>
