require('dotenv').config();

const url = process.env.ADMIN_API_URL;
const token = process.env.ADMIN_API_TOKEN;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': token
}

exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body);

  console.log(event, 'event');
  console.log(context, 'context');
  console.log(data, 'data');

  const payload = {
    query: `mutation {
      customerCreate(input: { email: ${data.email} }) {
        customer {
          id
        }
      }
    }`
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: response
    })
  };
}
