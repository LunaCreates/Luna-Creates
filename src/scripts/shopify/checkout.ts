import shopify from '../modules/shopify';

function Checkout() {
  const existingCheckoutId = localStorage.getItem('shopify_checkout_id');

  function createCheckout() {
    shopify.checkout.create().then(checkout => {
      localStorage.setItem('shopify_checkout_id', `${checkout.id}`);
    });
  }

  function updateCartCount(checkout: ShopifyBuy.Cart) {
    const count = checkout.lineItems.reduce((m, item) => m + item.quantity, 0);
    const cart = Array.from(document.querySelectorAll('[data-cart]'));

    cart.forEach(item => item.setAttribute('data-count', `${count}`));
  }

  function fetchExistingCheckout() {
    const checkoutId  = existingCheckoutId as string;

    shopify.checkout.fetch(checkoutId).then(checkout => {
      if (checkout.lineItems.length > 0) {
        updateCartCount(checkout);
      }
    });
  }

  function checkForCheckout() {
    if (!existingCheckoutId) {
      createCheckout();
    } else {
      fetchExistingCheckout();
    }
  }

  function init() {
    checkForCheckout();
  }

  return {
    init
  }
}

export default Checkout;
