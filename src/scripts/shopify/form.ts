import stateManager from "./stateManager";

function Form(product: HTMLElement) {
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

  async function renderKeyMap(keyMapData: Object) {
    const data = await fetchData(keyMapData);
    const response = await data.blob();
    const keyMapImage = URL.createObjectURL(response);

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
    const keys = formdata.getAll('key');
    const labels = colors.map((color, index) => buildLabelsData(color, keys, index));

    const keyMapData = {
      type,
      title,
      frameSize: size === 'x-large' ? 'extraLarge' : size,
      labels
    }

    renderKeyMap(keyMapData);
    stateManager.showKeyMapModal();
  }

  function handleSubmitEvent(event: Event) {
    const formData = new FormData(form as HTMLFormElement);
    event.preventDefault();

    buildKeyMapData(formData);
  }

  function togglePinColors(input: HTMLInputElement) {
    const pinColors: HTMLElement | null = product.querySelector('[data-pin-colors]');

    if (pinColors && input.value === 'yes') {
      pinColors.classList.add('pin-colors--key-text');
      return;
    }

    if (pinColors && input.value === 'no') {
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
