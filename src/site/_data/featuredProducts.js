// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function featuredProductsData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?featured`, {
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
          collectionByHandle(handle: "home-page") {
            products(first: 4) {
              edges {
                node {
                  title
                  handle
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                    maxVariantPrice {
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
    }
  });

  // handle errors
  if (data.errors) {
    const errors = data.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const products = data.data.collectionByHandle.products.edges.map(edge => edge.node);

  // format products objects
  const productsFormatted = products.map(item => {
    const minPrice = item.priceRange.minVariantPrice.amount;
    const maxPrice = item.priceRange.maxVariantPrice.amount;
    const currency = item.priceRange.minVariantPrice.currencyCode;

    return {
      title: item.title,
      slug: `/products/${item.handle}/`,
      imageAlt: item.images.edges[0].node.altText,
      image: item.images.edges[0].node.originalSrc.split('.jpg')[0],
      minPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(minPrice),
      maxPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(maxPrice),
    };
  });

  // return formatted products
  return productsFormatted;
}

// export for 11ty
module.exports = featuredProductsData;
