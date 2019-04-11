const path = require('path')
const linkPreWebpackPlugin = require('../index')
const { AutoWebPlugin } = require('web-webpack-plugin')

const autoWebPlugin = new AutoWebPlugin(path.resolve(__dirname, './src/pages'), {
  template: pageName => path.resolve(__dirname, './src/pages', pageName, 'index.html')
})

module.exports = {
  mode: 'production',
  // devtool: 'source-map',
  context: path.resolve(__dirname, './'),
  entry: autoWebPlugin.entry(),
  // entry: {
  //   login: './src/pages/login/index.js',
  //   main: './src/pages/main/index.js'
  // },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:8].js'
  },
  plugins: [
    autoWebPlugin,
    new linkPreWebpackPlugin(
      {
        template: './test/src/pages/login/index.html',
        filename: 'login.html'
      },
      [
        {
          rel: 'preload',
          as: 'script',
          hrefs: ['https://cdn.bootcss.com/jquery/3.3.1/jquery.js']
        },
        {
          rel: 'preload',
          as: 'script',
          chunks: ['main']
        }
      ]
    )
  ]
}
