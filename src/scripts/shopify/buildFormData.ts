import shopify from '../modules/shopify';

const checkoutId = localStorage.getItem('shopify_checkout_id');

function buildAttributesData(formData: FormData) {
  const array = [];

  formData.delete('quantity');

  for (var pair of formData.entries()) {
    array.push({ key: pair[0], value: pair[1] });
  }

  return array;
}

function buildFormData(product: HTMLElement, formData: FormData) {
  const form: HTMLFormElement | null = product.querySelector('[data-product-form]');
  const id = form?.getAttribute('data-variant-id');
  const quantity = formData.get('quantity') as string;
  const attributes = buildAttributesData(formData);
  const lineItemsToAdd: any = [
    {
      variantId: id,
      quantity: parseFloat(quantity),
      customAttributes: attributes
    }
  ];

  if (checkoutId === null) return;

  shopify.checkout.addLineItems(checkoutId, lineItemsToAdd)
    .then(() => window.location.pathname = '/cart/');
}

export default buildFormData;
