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
    publicPath: 'static/',
    filename: '[name].[hash:8].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      maxAsyncRequests: 5, // 异步加载chunk的并发请求数量<=5
      maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: '-', // 命名分隔符
      cacheGroups: {
        // 缓存组，会继承和覆盖splitChunks的配置
        default: {
          // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true // 默认使用已有的模块
        },
        common: {
          test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
          priority: -10
        }
      }
    }
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
        chunks: ['common', 'main']
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
    //       chunks: ['common']
    //       // inject: 'head'
    //     }
    //   ]
    // )
  ]
}
