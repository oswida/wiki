const yaml = require("js-yaml");
const pug = require('pug');
const { btwTemplate, btwRender } = require("./btw");


// ------------------------------------
// Markdown - RPG Statblocks
// ------------------------------------


module.exports = {
  init (md, conf) {
    md.use((md, opts) => {
      const defaultOptions = {};
      let pluginOptions = Object.assign({}, defaultOptions);
      pluginOptions = Object.assign(pluginOptions, opts);
      const defaultFenceRenderer = md.renderer.rules.fence;
      md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
        const token = tokens[idx];
        if (token.info.match(/^statblock/)) {
          const data = yaml.load(token.content);
          if (!data.type) {
            return `<span style="color: red">Statblock error: Missing type specification.</span>`;
          }
          switch (data.type) {
            case "btw":
              const btw = pug.compile(btwTemplate);
              return btw(btwRender(data));
            default: return `<span>Unknown statblock type: ${data.type}</span>`
          }
          
        }
        return defaultFenceRenderer(tokens, idx, options, env, slf);
      }
    })
  }
}