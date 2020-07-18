// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function allCollectionsData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        collections(first: 50, query: "NOT title:home* AND NOT title:'All Products' AND NOT title:classic*") {
          edges {
            node {
              title
              handle
              image {
                originalSrc
              }
              products(first: 50) {
                edges {
                  node {
                    title
                    handle
                    priceRange {
                      minVariantPrice {
                        amount
                        currencyCode
                      }
                    }
                    images(first: 10) {
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
  const collections = response.data.collections.edges.map(edge => edge.node);

  function formatProducts(product) {
    const price = product.node.priceRange.minVariantPrice.amount;
    const currency = product.node.priceRange.minVariantPrice.currencyCode;

    return {
      title: product.node.title,
      slug: `/products/${product.node.handle}/`,
      mainImageAlt: product.node.images.edges[0].node.altText,
      mainImage: product.node.images.edges[0].node.originalSrc.split('.jpg')[0],
      price: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(price)
    }
  }

  // format collections objects
  const collectionsFormatted = collections.map(item => {
    const products = item.products.edges.map(formatProducts);

    return {
      title: item.title,
      slug: item.handle,
      heroImage: item.image.originalSrc.split('.jpg')[0],
      products: products
    };
  });

  // return formatted collections
  return collectionsFormatted;
}

// export for 11ty
module.exports = allCollectionsData;
