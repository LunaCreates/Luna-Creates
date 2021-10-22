const fetch = require('node-fetch');

require('dotenv').config();

exports.postToShopify = async ({ query, variables }) => {
  const url = process.env.STOREFRONT_API_URL;
  const token = process.env.STOREFRONT_API_TOKEN;

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token':
        token,
      },
      body: JSON.stringify({ query, variables }),
    }).then((res) => res.json())

    if (result.errors) {
      console.log({ errors: result.errors })
    } else if (!result || !result.data) {
      console.log({ result })
      return 'No results found.'
    }

    return result.data
  } catch (error) {
    console.log(error)
  }
}
