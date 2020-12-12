import pubSub from '../modules/pubSub';

function Price(element: HTMLElement) {
  function updatePrice(variantPrice: number) {
    const price = element.querySelector('[data-product-price]') as HTMLElement;

    price.textContent = `£${variantPrice.toFixed(2)}`;
  }

  function variantChanged(variant: HTMLOptionElement | HTMLInputElement) {
    const variantPrice = parseFloat(variant.getAttribute('data-price') as string);

    updatePrice(variantPrice);
  }

  function init() {
    pubSub.subscribe('variant/changed', variantChanged);
  }

  return {
    init
  }
}

export default Price;
