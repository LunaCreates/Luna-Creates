const Image = require('@11ty/eleventy-img');

module.exports = async (src, alt, className, loading = 'lazy') => {
  const hasAlt = alt === '' ? 'role="presentation"' : `alt="${alt}"`;

  const metadata = await Image(src, {
    widths: [null],
    formats: ['jpeg'],
    urlPath: '/images/',
    outputDir: './dist/images/shopify/'
  });

  const data = metadata.jpeg.pop();

  return `<img class="lazyload ${className}" src="${data.url}" width="${data.width}" height="${data.height}" loading="${loading}" ${hasAlt}>`;
}
