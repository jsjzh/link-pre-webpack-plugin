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
 * @param {String} filename 该文件名为其他 html-template-plugin 处理后输出的文件名
 * @param {Object} preload preload 相关配置
 * @param {Object} prefetch prefetch 相关配置
 */
class LinkPreWebpackPlugin {
  constructor({
    filename,
    preload: {
      js: { hrefs: preloadJsHrefs = [], chunks: preloadJsChunks = [], as: preloadJsAs = 'script' },
      css: { hrefs: preloadCssHrefs = [], chunks: preloadCssChunks = [], as: preloadCssAs = 'stype' }
      // another: {}
    }
    // prefetch: {}
  }) {
    this.filename = filename
    this.options = {
      preloadJsHrefs,
      preloadJsChunks,
      preloadJsAs,
      preloadCssHrefs,
      preloadCssChunks,
      preloadCssAs
    }

    this.preload = {
      jsResources: [],
      cssResources: [],
      anotherResources: [],
      mergeResources: []
    }

    this.prefetch = {
      jsResources: [],
      cssResources: [],
      anotherResources: [],
      mergeResources: []
    }

    this.htmlDocument = undefined
  }

  mergeResources() {
    this.preload.mergeResources = [
      ...this.preload.jsResources,
      ...this.preload.cssResources,
      ...this.preload.anotherResources
    ]
    this.prefetch.mergeResources = [
      ...this.prefetch.jsResources,
      ...this.prefetch.cssResources,
      ...this.prefetch.anotherResources
    ]
  }

  resolveChunksToHrefs(compilation) {
    let { options } = this
    options.preloadJsHrefs = [
      ...options.preloadJsHrefs,
      ...utils.transChunksToHrefs(compilation, options.preloadJsChunks, '.js')
    ]
    options.preloadCssHrefs = [
      ...options.preloadCssHrefs,
      ...utils.transChunksToHrefs(compilation, options.preloadCssChunks, '.css')
    ]
  }

  resolveHrefsToAttrs() {
    let {
      options: { preloadJsHrefs, preloadJsAs, preloadCssHrefs, preloadCssAs }
    } = this
    this.preload.jsResources = utils.transHrefsToPares5Attrs(preloadJsHrefs, preloadJsAs, 'preload')
    this.preload.cssResources = utils.transHrefsToPares5Attrs(preloadCssHrefs, preloadCssAs, 'preload')
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

    this.resolveChunksToHrefs(compilation)
    this.resolveHrefsToAttrs()
    this.mergeResources()

    this.htmlDocument.injectNode(this.preload, this.prefetch)

    this.addOutput(compilation)
    utils.logAssets(compilation)
  }

  apply(compiler) {
    compiler.hooks.afterPlugins.tap(PLUGINNAME, this.handleCompilerAfterPlugins.bind(this))
    compiler.hooks.afterCompile.tap(PLUGINNAME, this.handleCompilerAfterCompile.bind(this))
    compiler.hooks.emit.tap(PLUGINNAME, this.handleCompilerEmit.bind(this))

    compiler.hooks.watchRun.tap(PLUGINNAME, this.handleCompilerWatchRun.bind(this))
  }
}

module.exports = LinkPreWebpackPlugin
