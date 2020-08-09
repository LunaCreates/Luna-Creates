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
  console.log(event, 'event');
  console.log(context, 'context');
}
