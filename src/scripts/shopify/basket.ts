import pubSub from '../modules/pubSub';
import shopify from '../modules/shopify';

export type KeyMapProps = {
  id: string,
  image: string
}

function Basket(product: HTMLElement) {
  const checkoutId = localStorage.getItem('shopify_checkout_id');
  const basketButton = product.querySelector('[data-add-to-basket]');

  function storePreviewImages(id: string | null) {
    const image: HTMLImageElement | null = product.querySelector('[data-key-map] img');

    if (image === null || id === null) return;

    const localImages = localStorage.getItem('mapPreviews');
    const images: KeyMapProps[] = localImages === null ? [] : JSON.parse(localImages);

    images.push({ id, image: image.src });
    localStorage.setItem('mapPreviews', JSON.stringify(images));
  }

  function setAttributes(varaint: HTMLOptionElement) {
    const key = varaint.getAttribute('data-name');
    const value = varaint.getAttribute('value');

    return { key, value };
  }

  function updateBasketButton(varaint: HTMLOptionElement) {
    const variantId = varaint.getAttribute('data-id');
    const customAttributes = JSON.stringify(setAttributes(varaint));

    if (!basketButton || !variantId) return;

    basketButton.setAttribute('data-variant-id', variantId);
    basketButton.setAttribute('data-variant-options', customAttributes);
  }

  function updateBasket(event: Event) {
    if (!(event.target instanceof HTMLAnchorElement) || !checkoutId || !basketButton) return;

    const id: string | null = event.target.getAttribute('data-variant-id');
    const attributes = event.target.getAttribute('data-variant-options');
    const lineItemsToAdd: any = [
      {
        variantId: id,
        quantity: 1,
        customAttributes: [JSON.parse(attributes as string)]
      }
    ];

    event.preventDefault();

    storePreviewImages(id);

    shopify.checkout.addLineItems(checkoutId, lineItemsToAdd)
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
