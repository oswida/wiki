const mdCollapsible = require('markdown-it-collapsible')

// ------------------------------------
// Markdown - Collapsible
// ------------------------------------

module.exports = {
  init (md, opts) {
    md.use(mdCollapsible)
  }
}