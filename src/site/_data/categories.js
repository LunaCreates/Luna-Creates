// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function allCollectionsData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?categories`, {
    duration: '1s',
    type: 'json',
    fetchOptions: {
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
                descriptionHtml
                handle
                image {
                  originalSrc
                }
                products(first: 50, sortKey: COLLECTION_DEFAULT) {
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
    }
  });

  // handle errors
  if (data.errors) {
    const errors = data.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const collections = data.data.collections.edges
    .map(edge => edge.node)
    .filter(item => item.handle !== 'all');

  function formatProducts(product) {
    const minPrice = product.node.priceRange.minVariantPrice.amount;
    const maxPrice = product.node.priceRange.maxVariantPrice.amount;
    const currency = product.node.priceRange.minVariantPrice.currencyCode;

    return {
      title: product.node.title,
      slug: `/products/${product.node.handle}/`,
      mainImageAlt: product.node.images.edges[0].node.altText,
      mainImage: product.node.images.edges[0].node.originalSrc,
      minPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(minPrice),
      maxPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(maxPrice),
    }
  }

  function formatMetaDescription(collection) {
    switch (collection.handle) {
      case 'all':
        return 'View our stunning Range Of Travel Related Personalised World Map Pinboard Products For Sale. Order today for UK & International delivery.';
        break;
      case 'maps':
        return 'Shop from our range of Personalised World Map Pinboard Products For Sale. Order Online For Quick UK and International Delivery.';
        break;
      case 'wedding':
        return 'Check out our stunning range of Personalised Travel Themed Wedding Selections by Luna Creates. Order Online For Quick UK and International Delivery.';
        break;
      default:
        return 'Stunning Range Of Travel Related Personalised World Map Pinboard Products For Sale. Order Online For Quick UK Delivery.';
    }
  }

  // format collections objects
  const collectionsFormatted = collections.map(item => {
    const products = item.products.edges.map(formatProducts);
    const metaDescription = formatMetaDescription(item);

    return {
      title: item.title,
      description: item.descriptionHtml,
      slug: item.handle,
      heroImage: item.image.originalSrc,
      products,
      metaDescription
    };
  });

  // return formatted collections
  return collectionsFormatted;
}

// export for 11ty
module.exports = allCollectionsData;
