function Form(product: HTMLElement) {
  const form: HTMLFormElement | null = product.querySelector('[data-product-form]');

  function handleSubmitEvent(event: Event) {
    const target = event.target as HTMLFormElement;
    const formData = new FormData(form as HTMLFormElement);
    const isPersonalisedMap = formData.getAll('colors').length > 0;
    const formButton: HTMLButtonElement | null = target.querySelector('[data-product-submit]');

    event.preventDefault();

    if (isPersonalisedMap) {
      import('./buildKeyMapData')
        .then(module => module.default(product, formData, formButton));
    } else {
      import('./buildFormData')
        .then(module => module.default(product, formData));
    }
  }

  function handleClickEvent(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) return;

    const input = event.target as HTMLInputElement;

    if (event.target.hasAttribute('data-map-key')) {
      import('./togglePinColors')
        .then(module => module.default(product, input));
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
