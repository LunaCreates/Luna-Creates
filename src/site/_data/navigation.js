// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API;

async function navigationData() {
  const data = await fetch('https://lunacreates.co.uk/api/2020-04/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        collections(first: 10) {
          edges {
            node {
              title
              handle
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
  const shop = response.data.collections.edges.map(edge => edge.node);

  // format products objects
  const shopFormatted = shop.map(item => {
    return {
      title: item.title,
      url: `/${item.handle}/`,
    };
  });

  // return formatted navigation
  return [
    { title: 'Shop', url: '/collections/all/', collections: shopFormatted },
    { title: 'About Us', url: '/about-us/' },
    { title: 'Contact Us', url: '/contact-us/'},
    { title: 'Delivery', url: '/delivery/' }
  ];
}

// export for 11ty
module.exports = navigationData;
