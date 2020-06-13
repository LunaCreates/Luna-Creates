import pubSub from '../modules/pubSub';
import shopify from '../modules/shopify';

function Price(element: HTMLElement) {
  function updatePrice(product: ShopifyBuy.Product, options: any) {
    const price = element.querySelector('[data-product-price]') as HTMLElement;
    const selectedVariant = shopify.product.helpers.variantForOptions(product, options);

    price.textContent = `£${selectedVariant.price}`;
  }

  function variantChanged(varaint: HTMLOptionElement) {
    const productId = element.getAttribute('data-product-id') as string;
    const variantName = varaint.getAttribute('data-name') as string;
    const variantValue: string | null = varaint.textContent;
    const options = { [variantName]: variantValue };

    shopify.product.fetch(productId)
      .then(product => updatePrice(product, options));
  }

  function init() {
    pubSub.subscribe('variant/changed', variantChanged);
  }

  return {
    init
  }
}

export default Price;
