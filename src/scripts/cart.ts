import pubSub from './modules/pubSub';
import { KeyMapProps } from './shopify/basket';

export interface KeyMapImages {
  id: string,
  image: string
}

export interface CartBody {
  keyMapImages: KeyMapImages,
  checkoutData: ShopifyStorefront.CheckoutData
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function Cart(element: HTMLElement) {
  const form = element.querySelector('[data-form]');
  const cart = JSON.parse(localStorage.getItem('cart') as string) as ShopifyStorefront.CheckoutCreate[];

  async function fetchShopifyData(data: ShopifyStorefront.CheckoutCreate[], clientId: string) {
    const body = { data, clientId };
    const checkout = await fetch('/create', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const response = await checkout.json();

    return response.data.checkoutCreate.checkout;
  }

  async function fetchCartHtml(body: CartBody) {
    const checkout = await fetch('/items', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const response = await checkout.json();

    return response;
  }

  async function updateCartItems(data: ShopifyStorefront.CheckoutCreate[]) {
    const clientId = (<any>window).ga.getAll()[0].get('clientId');
    const keyMapImages: KeyMapImages = JSON.parse(localStorage.getItem('mapPreviews') as string);
    const checkoutData: ShopifyStorefront.CheckoutData = await fetchShopifyData(data, clientId);
    const body = { keyMapImages, checkoutData, clientId };

    console.log(clientId, 'clientId');

    if (form === null) return;

    form.innerHTML = await fetchCartHtml(body);
  }

  function removeKeyMapImage(variantId: string) {
    const images = JSON.parse(localStorage.getItem('mapPreviews') as string);

    if (images && images.length > 0) {
      const newImages = images.filter((image: KeyMapProps) => image.id !== variantId);

      localStorage.setItem('mapPreviews', JSON.stringify(newImages));
    }
  }

  function removeProductItem(target: HTMLButtonElement) {
    const variantId = target.getAttribute('data-variant-id') as string;
    const checkoutData = cart.filter((item) => item.variantId !== variantId);

    removeKeyMapImage(variantId);
    localStorage.setItem('cart', JSON.stringify(checkoutData));
    window.location.pathname = '/cart/';
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLElement;

    if (target.hasAttribute('data-variant-id')) {
      removeProductItem(target as HTMLButtonElement);
    }
  }

  function formatLineItems(variants: FormDataEntryValue[], quantities: FormDataEntryValue[]) {
    return variants.map((v, i) => {
      const q = parseFloat(quantities[i].toString());

      return { variantId: v, quantity: q };
    })
  }

  function handleSubmitEvent(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement);
    const variants = formData.getAll('variant');
    const quantities = formData.getAll('quantity');
    const items = formatLineItems(variants, quantities).reverse();
    const checkoutData = cart.map((item, i) => Object.assign({}, item, items[i]));

    event.preventDefault();

    localStorage.setItem('cart', JSON.stringify(checkoutData));
    window.location.pathname = '/cart/';
  }

  function init() {
    updateCartItems(cart);

    if (form === null) return;

    form.addEventListener('click', handleClickEvent);
    form.addEventListener('submit', handleSubmitEvent);
  }

  return {
    init
  }
}

export default Cart;
