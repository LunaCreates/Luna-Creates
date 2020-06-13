import shopify from '../modules/shopify.ts';

function Checkout(product: HTMLElement) {
  const existingCheckoutId = localStorage.getItem('shopify_checkout_id');

  function createCheckout() {
    shopify.checkout.create().then(checkout => {
      localStorage.setItem('shopify_checkout_id', `${checkout.id}`);
    });
  }

  function updateCartCount(count: number) {
    const cart = Array.from(document.querySelectorAll('[data-cart]'));

    console.log(cart, 'updateCartCount');

    cart.forEach(item => item.setAttribute('data-count', `${count}`));
  }

  function fetchExistingCheckout() {
    const checkoutId  = existingCheckoutId as string;

    shopify.checkout.fetch(checkoutId).then(checkout => {
      const items = checkout.lineItems;

      console.log(checkout, 'fetchExistingCheckout');

      if (items.length > 0) {
        updateCartCount(items.length);
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
