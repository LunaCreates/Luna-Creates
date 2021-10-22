const fetch = require('node-fetch');

require('dotenv').config();

exports.postToShopify = async ({ query, variables }) => {
  const url = process.env.STOREFRONT_API_URL;
  const token = process.env.STOREFRONT_API_TOKEN;

  console.log(url, 'postToShopify url');
  console.log(query, 'postToShopify query');
  console.log(variables, 'postToShopify variables');

  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
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
