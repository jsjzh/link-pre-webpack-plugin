const path = require('path')
const linkPreWebpackPlugin = require('../index')
const { AutoWebPlugin } = require('web-webpack-plugin')

const autoWebPlugin = new AutoWebPlugin(path.resolve(__dirname, './src/pages'), {
  // htmlMinify: true,
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
    filename: '[name].[hash:8].js',
    publicPath: '/static/'
  },
  plugins: [
    autoWebPlugin,
    new linkPreWebpackPlugin({ filename: 'login.html' }, [
      {
        rel: 'preload',
        as: 'style',
        hrefs: [
          'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css',
          'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css'
        ]
        // chunks: ['common']
      },
      {
        rel: 'preload',
        as: 'script',
        hrefs: [
          'https://cdn.bootcss.com/jquery/3.3.1/jquery.js',
          'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js'
        ],
        chunks: ['main']
        // inject: 'head'
      }
    ])
    // new linkPreWebpackPlugin(
    //   {
    //     template: './test/src/pages/main/index.html',
    //     filename: 'main.html'
    //   },
    //   [
    //     {
    //       rel: 'preload',
    //       as: 'style',
    //       hrefs: [
    //         'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css',
    //         'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css'
    //       ]
    //       // chunks: ['common']
    //     },
    //     {
    //       rel: 'preload',
    //       as: 'script',
    //       hrefs: [
    //         'https://cdn.bootcss.com/jquery/3.3.1/jquery.js',
    //         'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js'
    //       ],
    //       chunks: ['login']
    //       // inject: 'head'
    //     }
    //   ]
    // )
  ]
}
