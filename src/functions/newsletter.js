require('dotenv').config();

const fetch = require('node-fetch')
const url = process.env.ADMIN_API_URL;
const token = process.env.ADMIN_API_TOKEN;

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
  'X-Shopify-Access-Token': token
}

exports.handler = async (event, context, callback) => {
  try {
    const data = JSON.parse(event.body);
    const payload = {
      query: `mutation {
        customerCreate(input: { email: "${data.email}" acceptsMarketing: true }) {
          customer {
            id
            email
            acceptsMarketing
          }
        }
      }`
    };

    const query = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(query)
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
