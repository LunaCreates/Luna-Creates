// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function allProductsData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        products(first: 50, query: "available_for_sale:true") {
          edges {
            node {
              id
              title
              handle
              descriptionHtml
              tags
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              variants(first: 50) {
                edges {
                  node {
                    id
                    selectedOptions {
                      name,
                      value
                    }
                    priceV2 {
                      amount
                    }
                  }
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
  const products = response.data.products.edges.map(edge => edge.node);

  function getColorFromTags(tags) {
    return tags.filter(tag => tag.toLowerCase().match(/black|white|grey/));
  }

  function formatOptions(option) {
    return {
      id: option.node.id,
      name: option.node.selectedOptions[0].name,
      value: option.node.selectedOptions[0].value,
      price: option.node.priceV2.amount
    }
  }

  // format all product images
  function formatProductImages(image) {
    return {
      image: image.node.originalSrc.split('.jpg')[0],
      imageAlt: image.node.altText
    }
  }

  // format products objects
  const productsFormatted = products.map(item => {
    const color = getColorFromTags(item.tags);
    const options = item.variants.edges.map(formatOptions);
    const images = item.images.edges.map(formatProductImages);
    const price = item.priceRange.minVariantPrice.amount;
    const currency = item.priceRange.minVariantPrice.currencyCode;

    return {
      id: item.id,
      title: item.title,
      slug: `/products/${item.handle}`,
      tags: item.tags,
      description: item.descriptionHtml,
      color: color,
      options: options,
      mainImageAlt: item.images.edges[0].node.altText,
      mainImage: item.images.edges[0].node.originalSrc.split('.jpg')[0],
      thumbnails: images,
      price: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(price)
    };
  });

  // return formatted products
  return productsFormatted;
}

// export for 11ty
module.exports = allProductsData;
