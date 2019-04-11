const linkPreWebpackPlugin = require('../index')

module.export = {
  plugins: [new linkPreWebpackPlugin({ html: 'bar' })]
}
