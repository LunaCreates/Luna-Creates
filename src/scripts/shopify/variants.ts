import stateManager from './stateManager';

function variants(product: HTMLElement) {
  function variantChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    const variant = target[target.selectedIndex] as HTMLOptionElement;
    const form = product.querySelector('[data-product-form]') as HTMLFormElement;
    const variantIdInput = form.elements.namedItem('variantId')

    stateManager.variantChanged(variant);

    if (variantIdInput && variantIdInput instanceof HTMLInputElement) {
      variantIdInput.value = variant.value
    }
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
