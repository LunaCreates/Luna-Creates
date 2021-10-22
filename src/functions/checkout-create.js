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
    const body = JSON.parse(event.body);
    const lineItems = body.lineItems.map(item => {
      return {
        variantId: item.node.merchandise.id,
        customAttributes: item.node.attributes,
        quantity: item.node.quantity,
      }
    })

    const payload = {
      query: `mutation checkoutCreate($input: CheckoutCreateInput!) {
        checkoutCreate(input: $input) {
          checkout {
            id
            webUrl
            customAttributes {
              key
              value
            }
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
      variables: {
        input: {
          lineItems,
          customAttributes: [{ key: 'clientId', value: body.clientId }]
        }
      }
    }

    const query = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const result = await query.json()

    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(result.data.checkoutCreate.checkout)
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
