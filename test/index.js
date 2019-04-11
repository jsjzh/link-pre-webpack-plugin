const path = require('path')
const linkPreWebpackPlugin = require('../index')

module.exports = {
  mode: 'development',
  // devtool: 'source-map',
  context: path.resolve(__dirname, './'),
  entry: {
    login: './src/pages/login/index.js',
    main: './src/pages/main/index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[hash:8].js'
  },
  plugins: [
    new linkPreWebpackPlugin(
      {
        template: './test/src/pages/login/index.html',
        filename: 'index.html'
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
