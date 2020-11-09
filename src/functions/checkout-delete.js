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
    const { checkoutId, lineItems, productId } = data;
    const newLineItems = lineItems
      .filter(item => item.node.id !== productId)
      .map(item => {
        return {
          variantId: item.node.variant.id,
          quantity: item.node.quantity,
          customAttributes: item.node.customAttributes
        }
      });

    const payload = {
      query: `mutation checkoutLineItemsReplace($lineItems: [CheckoutLineItemInput!]!, $checkoutId: ID!) {
        checkoutLineItemsReplace(lineItems: $lineItems, checkoutId: $checkoutId) {
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
        }
      }`,
      variables: { lineItems: newLineItems, checkoutId }
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


// mutation {
//   checkoutLineItemsReplace(lineItems: [{ variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8z", quantity: 1 }, { variantId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC80", quantity: 1 }], checkoutId: "Z2lkOi8vc2hvcGlmeS9DaGVja291dC81ZDliYTZjOTlhNWY4YTVhNTFiYzllMzlmODEwNTNhYz9rZXk9NWIxZTg5NDQzNTZkMjMxOGU1N2ZlNjQwZDJiNjY1M2Y=",
//   ) {
//     checkout {
//       id
//       lineItems(first: 2) {
//         edges {
//           node {
//             id
//             title
//             quantity
//           }
//         }
//       }
//     }
//   }
// }
