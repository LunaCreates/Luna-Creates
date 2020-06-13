import Client from 'shopify-buy';

const shopify = Client.buildClient({
  storefrontAccessToken: 'cfec3febd330e764f5ecf98c6b9a5a44',
  domain: 'luna-creates.myshopify.com'
});

export default shopify;
