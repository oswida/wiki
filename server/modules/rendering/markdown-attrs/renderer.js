const mdAttrs = require('markdown-it-attrs')

// ------------------------------------
// Markdown - Attributes
// ------------------------------------

module.exports = {
  init (md, opts) {
    md.use(mdAttrs)
  }
}