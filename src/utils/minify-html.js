const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (outputPath.endsWith('.html')) {
    const minified = htmlmin.minify(content, {
      collapseWhitespace: true,
      conservativeCollapse: true,
      collapseBooleanAttributes: true,
      decodeEntities: true,
      keepClosingSlash: true,
      minifyCSS: true,
      minifyJS: true,
      processConditionalComments: true,
      removeAttributeQuotes: false,
      removeComments: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      sortAttributes: true,
      sortClassName: true,
      useShortDoctype: true
    });

    return minified;
  }

  return content;
}
