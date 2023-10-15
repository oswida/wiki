const mdWikilinks = require('markdown-it-wikilinks');

// ------------------------------------
// Markdown - Wikilinks
// ------------------------------------

module.exports = {
  init (md, conf) {
    md.use(mdWikilinks({
      baseURL: conf.baseURL,
      uriSuffix: conf.uriSuffix,
    }))
  }
}