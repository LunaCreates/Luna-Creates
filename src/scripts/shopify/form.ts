import stateManager from './stateManager';

function Form(product: HTMLElement) {
  const chosenPins: HTMLElement[] = [];
  const checkedPins: HTMLInputElement[] = [];

  const form: HTMLFormElement | null = product.querySelector('[data-product-form]');

  function handleSubmitEvent(event: Event) {
    const target = event.target as HTMLFormElement;
    const formData = new FormData(form as HTMLFormElement);
    const formButton: HTMLButtonElement | null = target.querySelector('[data-product-submit]');

    event.preventDefault();

    if (form?.getAttribute('data-product-form') === 'personalised') {
      import('./buildKeyMapData')
        .then(module => module.default(product, formData, formButton));
    } else {
      import('./buildFormData')
        .then(module => module.default(product, formData));
    }
  }

  function handleMapPriceUpdates() {
    const size = form?.querySelector('[data-map="size"]:checked');
    const frame = form?.querySelector('[data-map="frame"]:checked');
    const input = form?.querySelector(`[data-frame="${frame?.id}"][data-size="${size?.id}"]`);

    if (input) {
      stateManager.variantChanged(input as HTMLInputElement);
    }
  }

  function validateCheckedLimit() {
    const coloredPins: NodeListOf<HTMLInputElement> | undefined = form?.querySelectorAll('[name="colors"]:not(:checked)');
    const coloredPinsChosen = form?.querySelectorAll('[name="colors"]:checked');

    if (coloredPins === undefined) return;

    if (coloredPinsChosen?.length === 6) {
      coloredPins.forEach((pin: HTMLInputElement) => pin.disabled = true);
    } else {
      coloredPins.forEach((pin: HTMLInputElement) => pin.disabled = false);
    }
  }

  function removeCurrentPin(input: HTMLInputElement, currentPin: HTMLElement) {
    const foo = form?.querySelector(`[data-foo="${input.value}"]`);
    const currentPinInput: HTMLInputElement | null = currentPin.querySelector('[data-pin-label]');
    const newCheckedPins = checkedPins.filter(pin => pin !== input);

    if (!currentPinInput) return;

    checkedPins.splice(0, checkedPins.length, ...newCheckedPins);
    currentPinInput.value = '';
    foo?.remove();
  }

  function addCurrentPin(input: HTMLInputElement) {
    const inputParent = input.parentElement;
    const html = `<input type="checkbox" name="color" value="${input.value}" data-foo="${input.value}" checked hidden />`

    checkedPins.push(input);
    inputParent?.insertAdjacentHTML('beforeend', html);
  }

  function updateChosenPinsOrder(input: HTMLInputElement) {
    const pinColor = input.id.split('-pin')[0];
    const currentPin: HTMLElement | null | undefined = form?.querySelector(`[data-pin-chosen="${pinColor}"]`);

    if (!currentPin) return;

    const currentPinParent = currentPin.parentNode;
    const isInArray = checkedPins.indexOf(input) !== -1;

    currentPinParent?.appendChild(currentPin);

    isInArray ? removeCurrentPin(input, currentPin) : addCurrentPin(input);
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.getAttribute('data-map')?.match(/size|frame/)) {
      handleMapPriceUpdates();
    }

    if (target.name === 'colors') {
      validateCheckedLimit();
      updateChosenPinsOrder(target);
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
