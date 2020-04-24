// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function navigationData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        collections(first: 10, query: "NOT 'home page' AND NOT 2 AND NOT all AND NOT only") {
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

  shopFormatted.unshift({ title: 'Browse all', url: '/collections/all/'});

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
