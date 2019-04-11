const parse5 = require('parse5')

class HtmlDocument {
  constructor(content, options) {
    this.document = parse5.parse(content)
    this.options = options
    // console.log(this.document)
  }
}

module.exports = HtmlDocument
