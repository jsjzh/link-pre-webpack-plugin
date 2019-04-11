const path = require('path')
const fs = require('fs')
const querystring = require('querystring')
// const { SyncWaterfallHook } = require('tapable')
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

class LinkPreWebpackPlugin {
  constructor({ template: templateFile, filename }, options = []) {
    this.templateFile = path.resolve('./', templateFile)
    this.filename = filename
    this.options = options

    this.htmlDocument = undefined
  }

  buildTemplate(templateCont) {
    this.htmlDocument = new htmlDocument(templateCont, this.options)
  }

  handleCompilerAfterPlugins(compiler) {
    let { plugins } = compiler.options
  }

  handleCompilerWatchRun(watchCompiler) {
    console.log(watchCompiler.watchFileSystem.watcher.mtimes.changedTimes)
  }

  handleCompilerAfterCompile(compilation) {
    // console.log(Array.from(arguments).length)
  }

  handleCompilerEmit(compilation) {
    let { assets } = compilation
    // 如果 assets 中已经处理过该文件，则不使用 template 中的原文件
    // 使用其他 plugin 已经处理过的 html 文件
    let htmlAsset = assets[this.filename]
    let htmlCont = htmlAsset ? htmlAsset.source() : fs.readFileSync(this.templateFile, { encoding: 'utf8' })

    this.buildTemplate(htmlCont)
    utils.addOutput(compilation, this.filename, this.htmlDocument.serialize())
    utils.logAssets(compilation)
  }

  apply(compiler) {
    compiler.hooks.emit.tap(PLUGINNAME, this.handleCompilerEmit.bind(this))
    compiler.hooks.watchRun.tap(PLUGINNAME, this.handleCompilerWatchRun.bind(this))
    compiler.hooks.afterPlugins.tap(PLUGINNAME, this.handleCompilerAfterPlugins.bind(this))
    compiler.hooks.afterCompile.tap(PLUGINNAME, this.handleCompilerAfterCompile.bind(this))
  }
}

module.exports = LinkPreWebpackPlugin
