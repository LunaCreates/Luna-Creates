import checkout from './checkout';
import form from './form';
import price from './price';
import variants from './variants';
import keyMap from './keyMap';
import basket from './basket';

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
