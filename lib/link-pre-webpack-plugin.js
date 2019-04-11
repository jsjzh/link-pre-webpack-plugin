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
const { isProduction } = require('./utils')

class LinkPreWebpackPlugin {
  constructor({ template, filename }, options = []) {
    this.template = path.resolve('./', template)
    this.filename = filename
    this.options = options
    this.htmlDocument = undefined

    this.buildTemplate()
  }

  buildTemplate() {
    let { template } = this
    let templateCont = fs.readFileSync(template, { encoding: 'utf8' })
    this.htmlDocument = new htmlDocument(templateCont, this.options)
  }

  apply(compiler) {
    compiler.hooks.afterCompile.tap('linkPreWebpackPlugin', compilation => {
      console.log(compilation)
    })

    compiler.hooks.emit.tap('linkPreWebpackPlugin', compilation => {
      console.log(compilation)
    })

    compiler.hooks.watchRun.tap('linkPreWebpackPlugin', watchCompiler => {
      console.log(watchCompiler)
    })
  }
}

module.exports = LinkPreWebpackPlugin
