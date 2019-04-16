const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
const {
  SyncHook,
  SyncBailHook,
  SyncWaterfallHook,
  SyncLoopHook,
  AsyncParallelHook,
  AsyncParallelBailHook,
  AsyncSeriesHook,
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook
} = require('tapable')

const htmlDocument = require('./html-document')
const utils = require('./utils')

const PLUGINNAME = 'LinkPreWebpackPlugin'

/**
 * 该插件提供添加 preload 和 prefetch 的功能
 * 不处理插入 chunk 依赖的 js 或者 css 的功能
 * 所以该插件需要配合其他 html-template-plugin 一起使用
 *
 * 插入的 link 的 href 可以是完整地址的 uri
 * 也可以是希望 preload 的 chunk 模块名称
 *
 * @param {string} filename 该文件名为其他 html-template-plugin 处理后输出的文件名
 * @param {array} options 需要插入的 preload 或者 prefetch 的相关信息
 */
class LinkPreWebpackPlugin {
  constructor({ filename }, options = []) {
    this.filename = filename
    this.options = options

    this.preloadFiles = []
    this.preFetchFiles = []

    this.htmlDocument = undefined
  }

  resolveOptionsChunksToHrefs(compilation) {
    let { options } = this
    let {
      assets,
      namedChunks,
      options: {
        output: { publicPath = '' }
      }
    } = compilation

    // let assetNames = Object.keys(assets)
    // // let chunkNames = [...namedChunks.keys()]

    // console.log('\n assetNames\n ', assetNames, '\n')

    // options.forEach(option => {
    //   option.hrefs = utils.arrayIsNotEmpty(option.hrefs)
    //   let needChunks = utils.arrayIsNotEmpty(option.chunks)
    //   needChunks.forEach(needChunk => {})
    //   delete option.chunks
    // })

    options.forEach(option => {
      let { chunks } = option
      option.hrefs = option.hrefs && option.hrefs.length ? option.hrefs : []
      if (chunks && chunks.length) {
        option.hrefs = option.hrefs.concat(
          chunks.map(chunk => {
            for (const filename in assets) {
              if (assets.hasOwnProperty(filename)) {
                if (filename.endsWith('.js') && filename.indexOf(chunk) !== -1) return publicPath + filename
              }
            }
          })
        )
      }
      delete option.chunks
    })
  }

  resolveOptionsHrefs() {
    let { options } = this
    this.options = options.reduce((pre, curr) => {
      let { hrefs } = curr
      delete curr.hrefs
      return [...pre, ...hrefs.map(href => ({ ...curr, href }))]
    }, [])
  }

  resolveHtmlCont(compilation) {
    return compilation.assets[this.filename].source()
  }

  buildDocument(templateCont) {
    this.htmlDocument = new htmlDocument(templateCont)
  }

  addOutput(compilation) {
    compilation.assets[this.filename] = utils.createAsset(this.htmlDocument.serialize())
  }

  handleCompilerAfterPlugins(compiler) {
    if (!utils.hasHtmlTemplatePlugin(compiler))
      throw new Error(`
      link-pre-webpack-plugin need a html-template-plugin
      you can use web-webpack-plugin or html-webpack-plugin
    `)
    if (!utils.isInHtmlPluginBehind(compiler)) {
      throw new Error(`link-pre-webpack-plugin must in html-template-plugin behind`)
    }
  }

  handleCompilerWatchRun(watchCompiler) {
    console.log(watchCompiler.watchFileSystem.watcher.mtimes.changedTimes)
  }

  handleCompilerAfterCompile(compilation) {
    // console.log(Array.from(arguments).length)
  }

  handleCompilerEmit(compilation) {
    this.buildDocument(this.resolveHtmlCont(compilation))
    this.resolveOptionsChunksToHrefs(compilation)
    this.resolveOptionsHrefs()
    this.htmlDocument.injectNode(this.options)
    this.addOutput(compilation)

    // utils.logAssets(compilation)
  }

  apply(compiler) {
    compiler.hooks.afterPlugins.tap(PLUGINNAME, this.handleCompilerAfterPlugins.bind(this))
    compiler.hooks.afterCompile.tap(PLUGINNAME, this.handleCompilerAfterCompile.bind(this))
    compiler.hooks.emit.tap(PLUGINNAME, this.handleCompilerEmit.bind(this))

    compiler.hooks.watchRun.tap(PLUGINNAME, this.handleCompilerWatchRun.bind(this))
  }
}

module.exports = LinkPreWebpackPlugin
