import shopify from '../modules/shopify';
import stateManager from './stateManager';

function Form(product: HTMLElement) {
  const checkoutId = localStorage.getItem('shopify_checkout_id');
  const form: HTMLFormElement | null = product.querySelector('[data-product-form]');

  function fetchData(keyMapData: Object) {
    return fetch('https://api.pinmaps.co.uk/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(keyMapData)
    })
  }

  function storePreviewImages(keyMapImage: string) {
    const localImages = localStorage.getItem('mapPreviews');
    const images: Array<string> = localImages === null ? [] : JSON.parse(localImages);

    images.push(keyMapImage);
    localStorage.setItem('mapPreviews', JSON.stringify(images));
  }

  async function renderKeyMap(keyMapData: Object) {
    const data = await fetchData(keyMapData);
    const response = await data.blob();
    const keyMapImage = URL.createObjectURL(response);

    storePreviewImages(keyMapImage);
    stateManager.keyMapCreated(keyMapImage);
  }

  function buildLabelsData(color: FormDataEntryValue, keys: Array<FormDataEntryValue>, index: number) {
    return {
      color,
      title: keys.length > 0 ? keys[index] : ' '
    }
  }

  function buildKeyMapData(formdata: FormData) {
    const type = product.getAttribute('data-product-color');
    const size = formdata.get('size')?.toString().split(' (')[0].toLowerCase();
    const title = formdata.get('title');
    const colors = formdata.getAll('colors').filter(color => color !== 'none');
    const showKeyText = formdata.get('show key text');
    const keys = formdata.getAll('key');
    const labels = colors.map((color, index) => buildLabelsData(color, keys, index));

    console.log(showKeyText, 'buildKeyMapData');

    const keyMapData = {
      type,
      title,
      frameSize: size === 'x-large' ? 'extraLarge' : size,
      labels
    }

    renderKeyMap(keyMapData);
    stateManager.showKeyMapModal();
  }

  function buildAttributesData(formData: FormData) {
    const array = [];

    formData.delete('quantity');

    for (var pair of formData.entries()) {
      array.push({ key: pair[0], value: pair[1] });
    }

    return array;
  }

  function buildFormData(formData: FormData) {
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

  function handleSubmitEvent(event: Event) {
    const formData = new FormData(form as HTMLFormElement);
    const isPersonalisedMap = formData.getAll('colors').length > 0;

    event.preventDefault();

    isPersonalisedMap ? buildKeyMapData(formData) : buildFormData(formData);
  }

  function togglePinColors(input: HTMLInputElement) {
    const pinColors: HTMLElement | null = product.querySelector('[data-pin-colors]');
    const keyTextInput = pinColors?.querySelector('[id="map-key-1"]') as HTMLInputElement;

    if (pinColors && input.value === 'yes') {
      keyTextInput.required = true;
      pinColors.classList.add('pin-colors--key-text');
      return;
    }

    if (pinColors && input.value === 'no') {
      keyTextInput.required = false;
      pinColors.classList.remove('pin-colors--key-text');
      return;
    }
  }

  function handleClickEvent(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    if (event.target.hasAttribute('data-map-key')) {
      togglePinColors(event.target);
    }
  }

  function init() {
    if (form) {
      form.addEventListener('submit', handleSubmitEvent);
      form.addEventListener('click', handleClickEvent);
    }
  }

  return {
    init
  }
}

export default Form;
