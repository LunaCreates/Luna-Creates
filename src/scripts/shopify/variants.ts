import stateManager from './stateManager';

function variants(product: HTMLElement) {
  function variantChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selected = target.selectedIndex;
    const variant = target[selected];
    const form = product.querySelector('[data-product-form]') as HTMLFormElement;
    const variantId = variant.getAttribute('data-id') as string;

    stateManager.variantChanged(variant);
    form?.setAttribute('data-variant-id', variantId);
  }

  function init() {
    const variants = product.querySelector('[data-product-variants]');

    variants?.addEventListener('change', variantChanged);
  }

  return {
    init
  }
}

export default variants;
