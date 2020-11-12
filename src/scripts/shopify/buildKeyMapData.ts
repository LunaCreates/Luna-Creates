import stateManager from './stateManager';

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
  const reader = new FileReader();

  reader.readAsDataURL(response);
  reader.onloadend = () => stateManager.keyMapCreated(reader.result as string);
}

function formatColor(color: string) {
  switch (color) {
    case '#F8C3D3':
      return 'Pink';
    case '#84B6F9':
      return 'Light Blue';
    case '#538B65':
      return 'Green';
    case '#9D89E6':
      return 'Purple';
    case '#FFFFFF':
      return 'White';
    case '#EDD771':
      return 'Yellow';
    case '#DE3947':
      return 'Red';
    case '#475A88':
      return 'Blue';
    case '#ED8733':
      return 'Orange';
    default:
      return 'Black';
  }
}

function formatPins(pin: any) {
  const title = pin.title ? ` - ${pin.title}` : '';

  return `${formatColor(pin.color)}${title}`;
}

function buildPropertyData(product: HTMLElement, keyMapData: any) {
  const basketButton = product.querySelector('[data-add-to-basket]');
  const pins = keyMapData.labels.map(formatPins).join(', ');
  const propertyData = [
    { key: 'Title', value: keyMapData.title },
    { key: 'Size', value: keyMapData.frameSize },
    { key: 'Pins', value: pins },
    { key: 'Type', value: keyMapData.type }
  ]

  if (basketButton === null) return;

  const customAttributes = JSON.stringify(propertyData);

  basketButton.setAttribute('data-variant-options', customAttributes);
}

function buildLabelsData(color: FormDataEntryValue, keys: Array<FormDataEntryValue>, showKeyText: string, index: number) {
  if (showKeyText === 'no') {
    return {
      color,
      title: ' '
    }
  }

  return {
    color,
    title: keys.length > 0 ? keys[index] : ' '
  }
}

function buildKeyMapData(product: HTMLElement, formdata: FormData, target: HTMLButtonElement | null) {
  const type = product.getAttribute('data-product-color');
  const size = formdata.get('size')?.toString().split(' (')[0].toLowerCase();
  const title = formdata.get('title');
  const colors = formdata.getAll('colors').filter(color => color !== '');
  const showKeyText = formdata.get('show key text') as string;
  const keys = formdata.getAll('key');
  const labels = colors
    .map((color, index) => buildLabelsData(color, keys, showKeyText, index))
    .filter(label => label.color !== '');

  const keyMapData = {
    title,
    frameSize: size === 'x-large' ? 'extraLarge' : size,
    labels,
    type
  }

  renderKeyMap(keyMapData);
  buildPropertyData(product, keyMapData);
  stateManager.showKeyMapModal(target as HTMLButtonElement);
}

export default buildKeyMapData;
