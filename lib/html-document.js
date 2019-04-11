const parse5 = require('parse5')

class HtmlDocument {
  constructor(content, options) {
    this.document = parse5.parse(content + "demo")
    this.options = options
    console.log(content)
  }
  serialize() {
    return parse5.serialize(this.document)
  }
}

module.exports = HtmlDocument
