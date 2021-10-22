import postData from './modules/postData';
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
  const params = new URLSearchParams(location.search);
  const cartId = params.get('cartId');
  const form = element.querySelector('[data-form]');

  async function fetchCartHtml(body: any) {
    const checkout = await fetch('/cart-view', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const response = await checkout.json();

    return response;
  }

  async function updateCartItems(cartId: string | null) {
    const ga = (<any>window).ga
    const ifGA = typeof ga.getAll === 'function'
    const clientId = ifGA ? ga.getAll()[0].get('clientId') : ''
    const keyMapImages: KeyMapImages = JSON.parse(sessionStorage.getItem('mapPreviews') as string);
    const body = { cartId, clientId, keyMapImages };

    if (form === null) return;

    form.innerHTML = await fetchCartHtml(body);
  }

  function removeKeyMapImage(variantId: string) {
    const images = JSON.parse(sessionStorage.getItem('mapPreviews') as string);

    if (images && images.length > 0) {
      const newImages = images.filter((image: KeyMapProps) => image.id !== variantId);

      sessionStorage.setItem('mapPreviews', JSON.stringify(newImages));
    }
  }

  function removeProductItem(target: HTMLButtonElement) {
    const variantId = target.getAttribute('data-variant-id') as string;
    const data = { cartId, lineId: variantId };

    removeKeyMapImage(variantId);

    postData('/api/remove-item-from-cart', data).then(data => {
      const url = new URL(`${window.location.origin}/cart/?cartId=${data.id}`);

      window.location.href = url.href;
    });
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLElement;

    if (target.hasAttribute('data-variant-id')) {
      removeProductItem(target as HTMLButtonElement);
    }
  }

  function formatLineItems(variants: FormDataEntryValue[], quantities: FormDataEntryValue[], merchandise: FormDataEntryValue[]) {
    return variants.map((v, i) => {
      const q = parseFloat(quantities[i].toString());

      return { id: v, merchandiseId: merchandise[i], quantity: q };
    })
  }

  function handleSubmitEvent(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement);
    const merchandise = formData.getAll('merchandise');
    const variants = formData.getAll('variant');
    const quantities = formData.getAll('quantity');
    const items = formatLineItems(variants, quantities, merchandise).reverse();
    const data = { cartId, items }

    event.preventDefault();

    postData('/api/update-cart-items', data).then(data => {
      const url = new URL(`${window.location.origin}/cart/?cartId=${data.id}`);

      window.location.href = url.href;
    });
  }

  function init() {
    updateCartItems(cartId);

    if (form === null) return;

    form.addEventListener('click', handleClickEvent);
    form.addEventListener('submit', handleSubmitEvent);
  }

  return {
    init
  }
}

export default Cart;
