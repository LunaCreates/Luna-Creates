import pubSub from '../modules/pubSub';

function CartQuantity() {
  const basket = Array.from(document.querySelectorAll('[data-cart]'));

  function updateCartQuantity() {
    const cart = JSON.parse(localStorage.getItem('cart') as string) as ShopifyStorefront.CheckoutCreate[];

    if (basket.length < 1 || cart === null) return;

    const quantity = cart.reduce((m, item) => m + item.quantity, 0);
    basket.forEach(item => item.setAttribute('data-count', `${quantity}`));
  }

  function init() {
    updateCartQuantity();
    pubSub.subscribe('cart/changed', updateCartQuantity);
  }

  return {
    init
  }
}

export default CartQuantity;
