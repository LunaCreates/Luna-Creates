// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function instagramCollectionData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?instagram`, {
    duration: '1d',
    type: 'json',
    fetchOptions: {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Shopify-Storefront-Access-Token': `${token}`
      },
      body: JSON.stringify({
        query: `{
          productByHandle(handle: "instagram-images") {
            images(first: 6) {
              edges {
                node {
                  altText
                  originalSrc
                }
              }
            }
          }
        }`
      })
    }
  });

  // handle errors
  if (data.errors) {
    const errors = data.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const images = data.data.productByHandle.images.edges.map(edge => edge.node);

  // format images objects
  const imagesFormatted = images.map(image => {
    return {
      imageAlt: image.altText,
      image: image.originalSrc,
    };
  });

  // return formatted images
  return imagesFormatted;
}

// export for 11ty
module.exports = instagramCollectionData;
