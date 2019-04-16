const DefinePlugin = require('webpack/lib/DefinePlugin')
const Template = require('webpack').Template

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

function createPares5LinkNode(attrs) {
  return { nodeName: 'link', tagName: 'link', attrs }
}

function createPares5TextNode(value = '\n') {
  return { nodeName: '#text', value }
}

function injectNode(targetNode, node, location = 'after') {
  const { childNodes } = targetNode
  if (!childNodes) childNodes = []
  node.parentNode = targetNode
  if (location === 'after') {
    childNodes.push(node)
  } else if (location === 'before') {
    childNodes.unshift(node)
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

// TODO css 的 publicPath 该怎么处理
// TODO 能不能不使用 indexOf 因为当公共模块的文件名和其他模块文件名重复的时候，依赖会加载错误
function transChunksToHrefs({ assets, publicPath }, chunks, fileType) {
  let assetNames = Object.keys(assets).filter(assetName => assetName.endsWith(fileType))
  return chunks.map(chunk => {
    if (judgeType(chunk) === '[object String]') chunk = { chunk, attrs: [] }
    if (!chunk.attrs) chunk.attrs = []
    chunk.chunk = assetNames.find(assetName => assetName.indexOf(chunk.chunk) !== -1)
    chunk.href = publicPath + chunk.chunk
    delete chunk.chunk
    return chunk
  })
}

function transHrefsToPares5Attrs(hrefs, preAs, preType = 'preload') {
  return hrefs.map(href => {
    if (judgeType(href) === '[object String]') href = { href, attrs: [] }
    if (!href.attrs) href.attrs = []
    return [
      { name: 'as', value: preAs },
      { name: 'rel', value: preType },
      { name: 'href', value: href.href },
      ...href.attrs
    ]
  })
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
  arrayIsNotEmpty,
  transChunksToHrefs,
  transHrefsToPares5Attrs
}
