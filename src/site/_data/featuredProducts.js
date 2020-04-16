// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function featuredProductsData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
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
                handle
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
                      originalSrc
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
      slug: `/products/${item.handle}/`,
      imageAlt: item.images.edges[0].node.altText,
      image: item.images.edges[0].node.originalSrc.split('.jpg')[0],
      price: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(price)
    };
  });

  // return formatted products
  return productsFormatted;
}

// export for 11ty
module.exports = featuredProductsData;
