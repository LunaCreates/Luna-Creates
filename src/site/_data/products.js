// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function allProductsData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?products`, {
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
          products(first: 50, query: "available_for_sale:true") {
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                tags
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
                options(first: 10) {
                  name
                  values
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
                images(first: 25) {
                  edges {
                    node {
                      altText
                      originalSrc
                    }
                  }
                }
                metafields(first: 2, namespace: "global") {
                  edges {
                    node {
                      key
                      value
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
  const products = data.data.products.edges.map(edge => edge.node);

  function getColorFromTags(tags) {
    const arr = tags.map(tag => tag.toLowerCase());
    return arr.filter(tag => tag.match(/black|white|grey|kids/));
  }

  function formatVariants(variants) {
    return Object.assign({}, ...variants.map(variant => ({ [variant.name.toLowerCase()]: variant.value.toString() })));
  }

  function formatSize(option) {
    return option.name.match(/Options|Pins|Size|Title|Style|Denominations/);
  }

  function formatOptions(option) {
    const options = option.node.selectedOptions;
    const size = options.find(formatSize);

    return {
      id: option.node.id,
      ...formatVariants(options),
      name: size.name,
      value: size.value,
      price: option.node.priceV2.amount
    }
  }

  // format all product images
  function formatProductImages(image) {
    return {
      image: image.node.originalSrc.split(/(.jpg|.png)/)[0],
      imageAlt: image.node.altText,
      type: image.node.originalSrc.match(/(.jpg|.png)/)[0]
    }
  }

  function formatMetaDescription(edges) {
    const isTitle = edges[0];
    const isDescription = edges[1];

    return {
      title: isTitle ? edges[0].node.value : '',
      description: isDescription ? edges[1].node.value : ''
    }
  }

  // format products objects
  const productsFormatted = products.map(item => {
    const images = item.images.edges.map(formatProductImages);
    const minPrice = item.priceRange.minVariantPrice.amount;
    const maxPrice = item.priceRange.maxVariantPrice.amount;
    const currency = item.priceRange.minVariantPrice.currencyCode;

    return {
      id: item.id,
      title: item.title,
      slug: item.handle,
      tags: item.tags,
      description: item.descriptionHtml,
      descriptionSchema: item.description,
      color: getColorFromTags(item.tags),
      options: item.variants.edges.map(formatOptions),
      mainImageAlt: item.images.edges[0].node.altText,
      mainImage: item.images.edges[0].node.originalSrc.split('.jpg')[0],
      thumbnails: images,
      minPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(minPrice),
      maxPrice: new Intl.NumberFormat('en-GB', { style: 'currency', currency: currency }).format(maxPrice),
      priceSchema: parseFloat(minPrice).toFixed(2),
      metaDescription: formatMetaDescription(item.metafields.edges)
    };
  });

  // return formatted products
  return productsFormatted;
}

// export for 11ty
module.exports = allProductsData;
