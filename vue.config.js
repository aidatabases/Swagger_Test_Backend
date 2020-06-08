// const path = require('path')

// function resolve (dir) {
//   return path.join(__dirname, '..', dir)
// }
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        // 'vuex-store': resolve('src/store')
        'vuex-store': '@/store/store'
      }
    }
  },
  lintOnSave: true
}
