
function togglePinColors(product: HTMLElement, input: HTMLInputElement) {
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

export default togglePinColors;
