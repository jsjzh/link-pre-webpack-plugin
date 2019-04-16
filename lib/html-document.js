const parse5 = require('parse5')
const utils = require('./utils')

class HtmlDocument {
  constructor(content) {
    // console.log(content)
    this.document = parse5.parse(content)
    this.html = utils.locateSingleNode(this.document, 'html')
    this.head = utils.locateSingleNode(this.html, 'head')
    this.body = utils.locateSingleNode(this.html, 'body')
  }

  injectNode({ mergeResources: preloadMergeResources }, { mergeResources: prefetchMergeResources }) {
    let newNodes = [
      ...preloadMergeResources.map(utils.createPares5LinkNode),
      ...prefetchMergeResources.map(utils.createPares5LinkNode)
    ]
    newNodes.forEach(node => utils.injectNode(this.head, node, 'after'))
  }

  serialize() {
    return parse5.serialize(this.document)
  }
}

module.exports = HtmlDocument
