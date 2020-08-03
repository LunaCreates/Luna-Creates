// required packages
const Cache = require('@11ty/eleventy-cache-assets');

require('dotenv').config();

// Shopify Storefront token
const token = process.env.STOREFRONT_API_TOKEN;

async function paymentIconsData() {
  const data = await Cache(`${process.env.STOREFRONT_API_URL}?icons`, {
    duration: '1d',
    type: 'json',
    fetchOptions: {
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
    }
  });

  // handle errors
  if (data.errors) {
    const errors = data.errors;
    errors.map(error => console.log(error.message));
    throw new Error('Aborting: Shopify Storefront errors');
  }

  // get data from the JSON response
  const cards = data.data.shop.paymentSettings.acceptedCardBrands.reverse();
  const digital = data.data.shop.paymentSettings.supportedDigitalWallets;
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
