import postData from '../modules/postData';
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

    const localImages = sessionStorage.getItem('mapPreviews');
    const images: KeyMapProps[] = localImages === null ? [] : JSON.parse(localImages);

    images.push({ id, image: image.src });
    sessionStorage.setItem('mapPreviews', JSON.stringify(images));
  }

  function setAttributes(variant: HTMLOptionElement | HTMLInputElement) {
    const key = variant.getAttribute('data-name');
    const value = variant.getAttribute('data-id');

    return { key, value };
  }

  function updateBasketButton(variant: HTMLOptionElement | HTMLInputElement) {
    const variantId = variant.value;
    const customAttributes = JSON.stringify(setAttributes(variant));

    if (!basketButton || !variantId) return;

    basketButton.setAttribute('data-variant-id', variantId);
    basketButton.setAttribute('data-variant-options', customAttributes);
  }

  function postToCart(event: Event) {
    event.preventDefault();

    const element = event.target as HTMLAnchorElement
    const merchandiseId = element.getAttribute('data-variant-id');
    const attributes = element.getAttribute('data-variant-options');
    const data = {
      cartId: localStorage.getItem('shopifyCartId') || '',
      items: [{
        merchandiseId,
        quantity: 1,
        attributes: JSON.parse(attributes as string)
      }]
    }

    storePreviewImages(merchandiseId);

    postData('/api/add-to-cart', data).then(data => {
      const url = new URL(`${window.location.origin}/cart/?cartId=${data.id}`);

      // persist that cartId for subsequent actions
      localStorage.setItem('shopifyCartId', data.id);
      window.location.href = url.href;
    });
  }

  function init() {
    pubSub.subscribe('variant/changed', updateBasketButton);
    basketButton?.addEventListener('click', postToCart);
  }

  return {
    init
  }
}

export default Basket;
