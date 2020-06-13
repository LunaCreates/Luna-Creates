const fs = require('fs');
const htmlMin = require('./src/utils/minify-html.js');
const swStyles = require('./src/utils/filters/sw-styles.js');

module.exports = config => {
  const prod = process.env.NODE_ENV === 'prod';

  config.addShortcode('swStyles', swStyles);

  config.addPassthroughCopy({ 'src/favicons': 'favicons' });
  config.addPassthroughCopy({ 'src/fonts': 'fonts' });
  config.addPassthroughCopy({ 'src/images': 'images' });
  config.addPassthroughCopy({ 'src/site.webmanifest': 'site.webmanifest' });
  config.addPassthroughCopy({ 'src/browserconfig.xml': 'browserconfig.xml' });

  if (prod) {
    config.addTransform('htmlmin', htmlMin);
  }

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
    templateFormats: ['njk', 'html', 'liquid'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'liquid',
    dataTemplateEngine: 'njk',
    dir: {
      input: 'src/site',
      output: 'dist'
    },
  };
};
