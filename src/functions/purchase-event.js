const fetch = require('node-fetch');

const url = 'https://www.google-analytics.com';
const tid = 'UA-117442723-1';
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

function addProductData(product, index, arr) {
  const prId = index + 1;
  const productId = product.product_id;
  const variantId = product.variant_id;
  const name = product.name;
  const variant = product.variant_title;
  const price = parseFloat(product.price);
  const quantity = product.quantity;
  const isLast = index === arr.length - 1;
  const endParam = isLast ? '' : '&';

  return `pr${prId}id=${productId}&pr${prId}va=${variantId}&pr${prId}nm=${name}&pr${prId}va=${variant}&pr${prId}pr=${price}&pr${prId}qt=${quantity}${endParam}`;
}

function buildPayload(data) {
  const lineItems = data.line_items;
  const ti = data.name;
  const tr = parseFloat(data.total_price);
  const ts = parseFloat(data.total_shipping_price_set.shop_money.amount);
  const tcc = data.discount_applications[0].title;
  const notes = data.note_attributes;
  const cid = Object.assign({}, ...notes.filter(note => note.name === 'clientId'));

  return `v=1&t=pageview&tid=${tid}&cid=${cid.value}&dh=lunacreates.co.uk&dp=%2Fcheckout&dt=Checkout%20Page&ti=${ti}&tr=${tr}&ts=${ts}&tcc=${tcc}&pa=purchase&${lineItems.map(addProductData).join('')}`
}

exports.handler = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const payload = buildPayload(data);

  console.log(payload, 'payload');

  try {
    const query = await fetch(`${url}?${payload}`, {
      method: 'POST',
      headers
    });

    const result = await query.text();

    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }

    callback(null, response);
  } catch (error) {
    const response = {
      statusCode: 500,
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    }

    callback(null, response);
    console.log(error);
  }
}
