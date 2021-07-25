const Image = require('@11ty/eleventy-img');

require('dotenv').config();

module.exports = async (
  src,
  widths,
  sizes,
  attribute,
  alt,
  pictureClass,
  imageClass,
  urlPath = 'shopify',
  loading = 'lazy',
) => {
  const prod = process.env.NODE_ENV === 'production';
  const formats = prod ? ['avif', 'webp', 'jpeg'] : ['jpeg']
  const hasAlt = alt ? `alt="${alt}"` : 'role="presentation"';
  const metadata = await Image(src, {
    widths: JSON.parse(`[${widths}]`),
    formats,
    urlPath: `/images/${urlPath}/`,
    outputDir: `./dist/images/${urlPath}/`,
    cacheOptions: {
      duration: '15552000s'
    }
  });

  const lowsrc = metadata.jpeg[0];

  function renderLazySouce(imageFormat) {
    return `
      <source
        type="image/${imageFormat[0].format}"
        data-srcset="${imageFormat.map(entry => entry.srcset).join(', ')}"
        sizes="${sizes}"
      >
    `;
  }

  function renderSouce(imageFormat) {
    return `
      <source
        type="image/${imageFormat[0].format}"
        srcset="${imageFormat.map(entry => entry.srcset).join(', ')}"
        sizes="${sizes}"
      >
    `;
  }

  const result = `
    <picture class="${pictureClass}" ${attribute ? `${attribute}` : ''}>
      ${Object.values(metadata).map(renderLazySouce).join('\n')}
      <img class="lazyload ${imageClass}" data-srcset="${lowsrc.url}" width="${lowsrc.width}" height="${lowsrc.height}" loading="${loading}" ${hasAlt}>
    </picture>

    <noscript>
      <picture class="${pictureClass}">
        ${Object.values(metadata).map(renderSouce).join('\n')}
        <img ${imageClass ? `class="${imageClass}"` : ''} src="${lowsrc.url}" width="${lowsrc.width}" height="${lowsrc.height}" loading="${loading}" ${hasAlt}>
      </picture>
    </noscript>
  `;

  return result;
}
