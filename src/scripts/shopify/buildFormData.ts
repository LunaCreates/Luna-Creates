function buildAttributesData(formData: FormData) {
  const array = [];

  formData.delete('quantity');

  for (var pair of formData.entries()) {
    array.push({ key: pair[0], value: pair[1] });
  }

  return array;
}

function storeBasketItem(lineItemsToAdd: any) {
  const basket = JSON.parse(sessionStorage.getItem('cart') as string) || [];

  basket.push(lineItemsToAdd);
  sessionStorage.setItem('cart', JSON.stringify(basket));
  window.location.pathname = '/cart/';
}

function buildFormData(product: HTMLElement, formData: FormData) {
  const form: HTMLFormElement | null = product.querySelector('[data-product-form]');
  const id = form?.getAttribute('data-variant-id');
  const quantity = formData.get('quantity') as string;
  const attributes = buildAttributesData(formData);
  const lineItemsToAdd: any = {
    variantId: id,
    quantity: parseFloat(quantity),
    customAttributes: attributes
  };

  storeBasketItem(lineItemsToAdd);
}

export default buildFormData;
