const parse5 = require('parse5')
const utils = require('./utils')

class HtmlDocument {
  constructor(content, createElementOptions = []) {
    // console.log(content)
    this.document = parse5.parse(content)
    let injectNodes = createElementOptions.map(option => utils.createPares5LinkTag(option))
    console.log(injectNodes)
  }

  serialize() {
    return parse5.serialize(this.document)
  }
}

module.exports = HtmlDocument
