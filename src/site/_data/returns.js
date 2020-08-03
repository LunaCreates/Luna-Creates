// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function returnsData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?returns`, {
    duration: '1d',
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
          pageByHandle(handle: "terms-conditions") {
            title
            handle
            body
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
  const returnsData = data.data.pageByHandle;

  // format contact data objects
  const returnsFormatted = {
    title: returnsData.title,
    slug: returnsData.handle,
    body: returnsData.body
  };

  // return formatted contact data
  return returnsFormatted;
}

// export for 11ty
module.exports = returnsData;
