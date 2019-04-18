const path = require('path')
const LinkPreWebpackPlugin = require('../index')
const { AutoWebPlugin } = require('web-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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
    publicPath: '/static/',
    filename: 'filename-[name].[hash:8].js',
    chunkFilename: 'chunkFilename-[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '/static/',
              hmr: true
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all', // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 1, // 模块超过30k自动被抽离成公共模块
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
          name: 'common-js',
          test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
          priority: -10
        },
        styles: {
          name: 'common-style',
          test: /\.css$/
          // enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'filename-[name].[hash:8].css',
      chunkFilename: 'chunkFilename-[name].[hash:8].css'
    }),
    autoWebPlugin,
    new LinkPreWebpackPlugin('login.html', {
      preload: {
        js: {
          hrefs: [
            { href: 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js' },
            {
              href: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js',
              attrs: [{ name: 'media', value: '(max-width: 600px)' }]
            }
          ],
          chunks: [
            { chunk: 'common-js' },
            {
              chunk: 'main',
              attrs: [{ name: 'media', value: '(max-width: 600px)' }]
            }
          ]
        },
        css: {
          hrefs: [
            { href: 'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css' },
            {
              href: 'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css',
              attrs: [{ name: 'media', value: '(max-width: 600px)' }]
            }
          ],
          chunks: [
            {
              chunk: 'common-style',
              attrs: [{ name: 'media', value: '(max-width: 600px)' }]
            }
          ]
        }
      },
      prefetch: {
        js: {
          hrefs: [
            { href: 'https://cdn.bootcss.com/lodash.js/4.17.12-pre/lodash.min.js' },
            { href: 'https://cdn.bootcss.com/jquery/3.3.1/jquery.js' }
          ],
          chunks: [{ chunk: 'common-js' }, { chunk: 'main' }]
        },
        css: {
          hrefs: [
            { href: 'https://cdn.bootcss.com/animate.css/3.7.0/animate.min.css' },
            { href: 'https://cdn.bootcss.com/hover.css/2.3.1/css/hover-min.css' }
          ],
          chunks: [{ chunk: 'common-style' }]
        }
      }
    })
  ]
}
