// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API;

async function featuredProductsData() {
  const data = await fetch('https://lunacreates.co.uk/api/2020-04/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        collectionByHandle(handle: "home-page") {
          products(first: 3) {
            edges {
              node {
                id
                title
                onlineStoreUrl
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      altText
                      transformedSrc(maxWidth: 700, maxHeight: 700, crop: CENTER, preferredContentType: WEBP)
                    }
                  }
                }
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
  const products = response.data.collectionByHandle.products.edges.map(edge => edge.node);

  // format products objects
  const productsFormatted = products.map(item => {
    const price = item.priceRange.minVariantPrice.amount;
    const currency = item.priceRange.minVariantPrice.currencyCode;

    return {
      title: item.title,
      slug: item.onlineStoreUrl,
      imageAlt: item.images.edges[0].node.altText,
      image: item.images.edges[0].node.transformedSrc,
      price: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(price)
    };
  });

  // return formatted products
  return productsFormatted;
}

// export for 11ty
module.exports = featuredProductsData;
