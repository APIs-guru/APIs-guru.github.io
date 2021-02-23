const pluginSEO = require('eleventy-plugin-seo');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSEO, require("./src/_data/seo.json"));

  // You can return your Config object (optional).
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};

