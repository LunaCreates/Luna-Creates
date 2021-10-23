import postData from '../modules/postData';

function buildAttributesData(formData: FormData) {
  const array = [];

  formData.delete('quantity');
  formData.delete('cartId');
  formData.delete('variantId');

  for (var pair of formData.entries()) {
    array.push({ key: pair[0], value: pair[1] });
  }

  return array;
}

function buildFormData(formData: FormData) {
  const merchandiseId = formData.get('variantId');
  const quantity = parseFloat(formData.get('quantity') as string);
  const attributes = buildAttributesData(formData);
  const data= {
    cartId: localStorage.getItem('shopifyCartId') || '',
    items: [{
      merchandiseId,
      quantity,
      attributes
    }]
  };

  postData('/api/add-to-cart', data).then(res => {
    const url = new URL(`${window.location.origin}/cart/?cartId=${res.id}`);

    // persist that cartId for subsequent actions
    localStorage.setItem('shopifyCartId', res.id);

    window.location.href = url.href;
  });
}

export default buildFormData;
