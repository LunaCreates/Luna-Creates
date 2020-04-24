// required packages
const fetch = require('node-fetch');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function paymentIconsData() {
  const data = await fetch(process.env.STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Shopify-Storefront-Access-Token': `${token}`
    },
    body: JSON.stringify({
      query: `{
        shop {
          paymentSettings {
            supportedDigitalWallets
            acceptedCardBrands
          }
        }
      }`
    })
  });

  // store the JSON response when promise resolves
  const response = await data.json();

  // handle errors
  if (response.errors) {
    const errors = response.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const cards = response.data.shop.paymentSettings.acceptedCardBrands.reverse();
  const digital = response.data.shop.paymentSettings.supportedDigitalWallets;
  const icons = cards.concat(digital).filter(card => card !== 'SHOPIFY_PAY');

  // return formatted payment icons
  const iconsFormatted = icons.map(icon => {
    return {
      title: icon.toLowerCase().replace('_', ' '),
      id: icon.toLowerCase().replace('_', '-')
    }
  });

  return iconsFormatted;
}

// export for 11ty
module.exports = paymentIconsData;
