import stateManager from './stateManager';

function Form(product: HTMLElement) {
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

  function buildChosenPinHtml(textColor: string | null, hexColor: string) {
    return `
      <div class="pos-r dp-f jc-between ai-c mt-24" id="${textColor}-chosen" data-pin-chosen="${textColor}">
        <span class="pin-color pos-r borr-50" style="width: 2.5rem; height: 2.5rem; background-color: ${hexColor};" aria-hidden="true"></span>

        <label for="${textColor}-text" class="pin-color pos-r borr-50" style="width: 2.5rem; height: 2.5rem; background-color: ${hexColor};">
          <span class="sr-only">Enter your ${textColor} pins label</span>
        </label>

        <input class="pin-color__text fg-3 ml-8 py-8 px-16 fs-sm lh-sm fvs-rg text-heading" type="text" maxlength="35" placeholder="${textColor} pins label" id="${textColor}-text" name="pin label">

        <p class="dp-n fg-3 ml-8 py-8 px-16 fs-sm fst-italic lh-sm fvs-rg text-heading">30x ${textColor} pins </p>
      </div>
    `;
  }

  function handleChosenPin(input: HTMLInputElement) {
    const pinsSection = form?.querySelector('[data-chosen-pins]');
    const chosenPinColor = input.getAttribute('data-pin');
    const chosenPinHexColor = input.value;

    if (!pinsSection) return;

    const chosenPinLabel = pinsSection.querySelector(`[data-pin-chosen="${chosenPinColor}"]`);

    const html = buildChosenPinHtml(chosenPinColor, chosenPinHexColor);

    if (!input.checked && chosenPinLabel) {
      chosenPinLabel.remove();
    } else {
      pinsSection.insertAdjacentHTML('beforeend', html);
    }

    Array.from(pinsSection.querySelectorAll('[data-pin-chosen]')).forEach((pin, index) => {
      const chosenPin = pin.id.split('-')[0];
      const pinCheckbox: HTMLInputElement | null | undefined = form?.querySelector(`[data-pin="${chosenPin}"]`);

      if (!pinCheckbox) return;

      pinCheckbox.value += `-${index}`;
    })
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

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.hasAttribute('data-pin')) {
      handleChosenPin(target);
    }

    if (target.getAttribute('data-map')?.match(/size|frame/)) {
      handleMapPriceUpdates();
    }

    if (target.name === 'colors') {
      validateCheckedLimit();
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
