// import pubSub from '../modules/pubSub';
import stateManager from './stateManager';

function Varaints(product: HTMLElement) {
  function variantChanged(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selected = target.selectedIndex;
    const variant = target[selected];

    stateManager.variantChanged(variant);
  }

  function init() {
    const varinats = product.querySelector('[data-product-variants]');

    varinats?.addEventListener('change', variantChanged);
  }

  return {
    init
  }
}

export default Varaints;
