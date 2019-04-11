const DefinePlugin = require('webpack/lib/DefinePlugin')

function judgeType(value) {
  return Object.prototype.toString.call(value)
}

function isProduction(compiler) {
  if (process.env.NODE_ENV === 'production') return true
  let { plugins } = compiler.options
  for (let i = 0; i < plugins.length; i++) {
    const plugin = plugins[i]
    try {
      if (plugin.__proto__.constructor === DefinePlugin) {
        if (plugin.definitions['process.env.NODE_ENV'] === '"production"') return true
      }
    } catch (err) {
      console.error(err)
    }
  }
  return false
}

function createAsset(content) {
  return {
    source() {
      return content
    },
    size() {
      return Buffer.byteLength(content, 'utf8')
    }
  }
}

function addOutput(compilation, filename, content) {
  compilation.assets[filename] = createAsset(content)
}

function logAssets(compilation) {
  let { assets } = compilation
  for (const filename in assets) {
    if (assets.hasOwnProperty(filename)) {
      const asset = assets[filename]
      console.log(`${filename} --- size --- `, `${asset.size()} bytes`)
    }
  }
}

function createPares5LinkTag(option) {
  return {
    nodeName: 'link',
    tagName: 'link',
    attrs: createAttrs(option)
  }
}

function createAttrs(option) {
  let attrs = []
  for (const name in option) {
    if (option.hasOwnProperty(name)) {
      const value = option[name]
      if (judgeType(value) === '[object String]') {
        attrs.push({ name, value })
      } else if (judgeType(value) === '[object Array]') {
        attrs.push(...value.map(val => ({ name, value: val })))
      }
    }
  }
  return attrs
}

module.exports = {
  isProduction,
  addOutput,
  logAssets,
  createPares5LinkTag
}
