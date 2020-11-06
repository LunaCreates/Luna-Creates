import pubSub from '../modules/pubSub';
import shopify from '../modules/shopify';

export type KeyMapProps = {
  id: string,
  image: string
}

function Basket(product: HTMLElement) {
  const basketButton = product.querySelector('[data-add-to-basket]');

  function storePreviewImages(id: string | null) {
    const image: HTMLImageElement | null = product.querySelector('[data-key-map] img');

    if (image === null || id === null) return;

    const localImages = localStorage.getItem('mapPreviews');
    const images: KeyMapProps[] = localImages === null ? [] : JSON.parse(localImages);

    images.push({ id, image: image.src });
    localStorage.setItem('mapPreviews', JSON.stringify(images));
  }

  function setAttributes(variant: HTMLOptionElement) {
    const key = variant.getAttribute('data-name');
    const value = variant.getAttribute('value');

    return { key, value };
  }

  function updateBasketButton(variant: HTMLOptionElement) {
    const variantId = variant.getAttribute('data-id');
    const customAttributes = JSON.stringify(setAttributes(variant));

    if (!basketButton || !variantId) return;

    basketButton.setAttribute('data-variant-id', variantId);
    basketButton.setAttribute('data-variant-options', customAttributes);
  }

  function updateBasket(event: Event) {
    const checkoutId = localStorage.getItem('shopify_checkout_id');

    event.preventDefault();

    if (!(event.target instanceof HTMLAnchorElement) || !checkoutId || !basketButton) return;

    const id: string | null = event.target.getAttribute('data-variant-id');
    const attributes = event.target.getAttribute('data-variant-options');
    const lineItemsToAdd: any = [
      {
        variantId: id,
        quantity: 1,
        customAttributes: JSON.parse(attributes as string)
      }
    ];

    shopify.checkout.addLineItems(checkoutId, lineItemsToAdd)
      .then(() => storePreviewImages(id))
      .then(() => window.location.pathname = '/cart/');
  }

  function init() {
    pubSub.subscribe('variant/changed', updateBasketButton);
    basketButton?.addEventListener('click', updateBasket);
  }

  return {
    init
  }
}

export default Basket;
