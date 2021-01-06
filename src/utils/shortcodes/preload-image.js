const Image = require('@11ty/eleventy-img');

module.exports = async (
  src,
  widths,
  sizes,
) => {
  const metadata = await Image(src, {
    widths: JSON.parse(`[${widths}]`),
    formats: ['webp'],
    urlPath: '/images/shopify/',
    outputDir: './src/images/shopify/',
    cacheOptions: {
      duration: '15552000s'
    }
  });

  function renderPreloadTags(imageFormat) {
    return `
      <link
        rel="preload"
        as="image"
        type="image/${imageFormat[0].format}"
        imagesrcset="${imageFormat.map(entry => entry.srcset).join(', ')}"
        imagesizes="${sizes}"
      />
    `;
  }

  const result = Object.values(metadata).map(renderPreloadTags).join('\n');

  return result;
}
