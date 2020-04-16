// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function instagramCollectionData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
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
  });

  // store the JSON response when promise resolves
  const response = await data.json();

  // handle errors
  if (response.errors) {
    const errors = response.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const images = response.data.productByHandle.images.edges.map(edge => edge.node);

  // format images objects
  const imagesFormatted = images.map(image => {
    return {
      imageAlt: image.altText,
      image: image.originalSrc.split('.jpg')[0],
    };
  });

  // return formatted images
  return imagesFormatted;
}

// export for 11ty
module.exports = instagramCollectionData;
