import checkout from './checkout.ts';
import form from './form.ts';
import price from './price.ts';
import variants from './variants.ts';
import keyMap from './keyMap.ts';
import basket from './basket.ts';

function Shopify(product: HTMLElement) {
  function init() {
    checkout(product).init();
    form(product).init();
    price(product).init();
    basket(product).init();
    variants(product).init();
    keyMap(product).init();
  }

  return {
    init
  }
}

export default Shopify;
