const pluginXML = require('eleventy-xml-plugin');

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginXML);

  // You can return your Config object (optional).
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};

