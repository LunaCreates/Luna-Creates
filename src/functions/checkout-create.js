require('dotenv').config();

const fetch = require('node-fetch')
const url = process.env.STOREFRONT_API_URL;
const token = process.env.STOREFRONT_API_TOKEN;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': token
}

exports.handler = async function (event, context, callback) {
  try {
    const data = JSON.parse(event.body);
    const payload = {
      query: `mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            lineItems(first: 5) {
              edges {
                node {
                  id
                  title
                  quantity
                  customAttributes {
                    key
                    value
                  }
                  variant {
                    id
                    image {
                      altText
                      originalSrc
                    }
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
          checkoutUserErrors {
            field
            message
          }
        }
      }`,
      variables: { input: { lineItems: data } }
    }

    const query = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const body = await query.json()

    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(body)
    }

    callback(null, response);
  } catch (error) {
    const response = {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }

    callback(null, response);
    console.log(error);
  }
}
