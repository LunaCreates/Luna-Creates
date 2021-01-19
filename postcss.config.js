const plugin = require('./_config/plugins.json');

module.exports = {
  plugins: [
    require('tailwindcss')('./src/styles/tailwind.config.js'),
    require('autoprefixer'),
    require('postcss-sort-media-queries'),
    require('postcss-minify-selectors'),
    require('cssnano')(plugin.cssnano)
  ],
};
