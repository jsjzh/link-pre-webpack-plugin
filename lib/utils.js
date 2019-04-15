const DefinePlugin = require('webpack/lib/DefinePlugin')

const supportHtmlTemplatePlugins = ['AutoWebPlugin', 'WebPlugin', 'HtmlWebpackPlugin']

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

function logAssets(compilation) {
  let { assets } = compilation
  for (const filename in assets) {
    if (assets.hasOwnProperty(filename)) {
      const asset = assets[filename]
      console.log(`${filename} --- size --- `, `${asset.size()} bytes`)
    }
  }
}

function createPares5LinkNode(option) {
  return { nodeName: 'link', tagName: 'link', attrs: _createAttrs(option) }
}

function createPares5TextNode(value = '\n') {
  return { nodeName: '#text', value }
}

function _createAttrs(option) {
  let attrs = []
  for (const name in option) {
    if (option.hasOwnProperty(name)) {
      const value = option[name]
      switch (name) {
        case 'hrefs':
          attrs.push(...value.map(val => ({ name: 'href', value: val })))
          break
        case 'attrs':
          attrs = attrs.concat(value)
          break
        case 'crossorigin':
          value ? attrs.push({ name, value: 'anonymous' }) : ''
          break
        default:
          switch (judgeType(value)) {
            case '[object String]':
              attrs.push({ name, value })
              break
            case '[object Array]':
              attrs = attrs.concat(value)
              break
            default:
              console.error('parameter is error')
              break
          }
          break
      }
    }
  }
  return attrs
}

function injectNode(targetNode, injectNode, location = 'after') {
  const { childNodes } = targetNode
  if (!childNodes) childNodes = []
  injectNode.parentNode = targetNode
  if (location === 'after') {
    childNodes.push(injectNode)
  } else if (location === 'before') {
    childNodes.unshift(injectNode)
  }
}

function locateSingleNode(nodes, nodeName) {
  if (!Array.isArray(nodes)) nodes = [nodes]
  for (let index = 0; index < nodes.length; index++) {
    const currNode = nodes[index]
    if (currNode.nodeName === nodeName) return currNode
    if (currNode.childNodes && currNode.childNodes.length) {
      let node = locateSingleNode(currNode.childNodes, nodeName)
      if (node) return node
    }
  }
}

function _constructorName(theClass) {
  return theClass.__proto__.constructor.name
}

function hasHtmlTemplatePlugin(compiler) {
  let { plugins } = compiler.options
  return plugins.some(plugin => supportHtmlTemplatePlugins.includes(_constructorName(plugin)))
}

function isInHtmlPluginBehind(compiler) {
  let { plugins } = compiler.options
  let pluginIndex = plugins.findIndex(plugin => _constructorName(plugin) === 'LinkPreWebpackPlugin')
  let htmlPluginIndexs = plugins.reduce(
    (prev, curr, currIndex) =>
      supportHtmlTemplatePlugins.includes(_constructorName(curr)) ? [...prev, currIndex] : prev,
    []
  )
  return pluginIndex === Math.max.apply(null, [...htmlPluginIndexs, pluginIndex])
}

function arrayIsNotEmpty(array) {
  return array && Array.isArray(array) && array.length !== 0 ? array : []
}

module.exports = {
  judgeType,
  isProduction,
  createAsset,
  logAssets,
  createPares5LinkNode,
  createPares5TextNode,
  locateSingleNode,
  injectNode,
  hasHtmlTemplatePlugin,
  isInHtmlPluginBehind,
  arrayIsNotEmpty
}
