<script>
export default {
  name: 'ValidationMixin',
  methods: {
    isValidInput () {
      this.$v.$touch()
      return !this.$v.$invalid
    }
  }
}
</script>
