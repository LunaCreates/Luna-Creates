const fs = require('fs');
// const image = require('./src/utils/shortcodes/image.js');
const picture = require('./src/utils/shortcodes/picture.js');
const preloadImage = require('./src/utils/shortcodes/preload-image.js');
const formatDate = require('./src/utils/filters/format-date.js');
const readableDate = require('./src/utils/filters/readable-date.js');
const htmlMin = require('./src/utils/minify-html.js');
const swStyles = require('./src/utils/shortcodes/sw-styles.js');
const swScripts = require('./src/utils/shortcodes/sw-scripts.js');
const swBuildNumber = require('./src/utils/shortcodes/sw-build-number.js');
const { maxPostsPerPage } = require('./src/site/_data/settings.json');

module.exports = config => {
  const prod = process.env.NODE_ENV === 'production';
  const now = new Date();
  const livePosts = post => post.data.publish_date <= now && !post.data.is_draft;

  // Filters
  config.addFilter('formatDate', formatDate);
  config.addFilter('readableDate', readableDate);

  // Shortcodes
  config.addShortcode('swStyles', swStyles);
  config.addShortcode('swScripts', swScripts);
  config.addShortcode('swBuildNumber', swBuildNumber);
  // config.addNunjucksAsyncShortcode('image', image);
  config.addNunjucksAsyncShortcode('picture', picture);
  config.addNunjucksAsyncShortcode('preloadImage', preloadImage);

  // Passthrough copy
  config.addPassthroughCopy({ 'src/cms': 'cms' });
  config.addPassthroughCopy({ 'src/favicons': 'favicons' });
  config.addPassthroughCopy({ 'src/fonts': 'fonts' });
  config.addPassthroughCopy({ 'src/images': 'images' });
  config.addPassthroughCopy({ 'src/site.webmanifest': 'site.webmanifest' });
  config.addPassthroughCopy({ 'src/browserconfig.xml': 'browserconfig.xml' });
  config.addPassthroughCopy({ 'src/robots.txt': 'robots.txt' });
  config.addPassthroughCopy({ 'src/_redirects': '_redirects' });

  if (prod) {
    config.addTransform('htmlmin', htmlMin);
  }

  // Custom collections
  config.addCollection('postFeed', collection => {
    return [...collection.getFilteredByGlob('./src/site/blog/*.md')]
      .filter(livePosts)
      .reverse()
      .slice(0, maxPostsPerPage);
  });

  // 404
  config.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, bs) {
        const content_404 = fs.readFileSync('dist/404.html');

        bs.addMiddleware('*', (req, res) => {
          res.write(content_404);
          res.end();
        });
      }
    }
  });

  return {
    dir: {
      input: 'src/site',
      output: 'dist'
    },
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true
  };
};
