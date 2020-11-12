import pubSub from '../modules/pubSub';

export interface KeyMapProps {
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

  function storeBasketItem(lineItemsToAdd: any) {
    const basket = JSON.parse(localStorage.getItem('cart') as string) || [];

    basket.push(lineItemsToAdd);
    localStorage.setItem('cart', JSON.stringify(basket));
    window.location.pathname = '/cart/';
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
    if (!(event.target instanceof HTMLAnchorElement) || !basketButton) return;

    event.preventDefault();

    const id: string | null = event.target.getAttribute('data-variant-id');
    const attributes = event.target.getAttribute('data-variant-options');
    const lineItemsToAdd: any = {
      variantId: id,
      quantity: 1,
      customAttributes: JSON.parse(attributes as string)
    };

    storePreviewImages(id);
    storeBasketItem(lineItemsToAdd);
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
