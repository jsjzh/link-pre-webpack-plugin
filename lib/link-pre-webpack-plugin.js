class linkPreWebpackPlugin {
  constructor(options = {}) {
    console.log(options)
  }
  apply(compiler) {
    console.log(compiler)
  }
}

module.exports = linkPreWebpackPlugin
