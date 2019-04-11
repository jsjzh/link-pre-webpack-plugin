const DefinePlugin = require('webpack/lib/DefinePlugin')

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

module.exports = {
  isProduction,
  addOutput,
  logAssets
}
