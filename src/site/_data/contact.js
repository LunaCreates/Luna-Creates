// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function contactData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?contact`, {
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
          pageByHandle(handle: "contact-us") {
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
  const contactData = data.data.pageByHandle;

  // format contact data objects
  const contactFormatted = {
    title: contactData.title,
    slug: contactData.handle,
    body: contactData.body
  };

  // return formatted contact data
  return contactFormatted;
}

// export for 11ty
module.exports = contactData;
