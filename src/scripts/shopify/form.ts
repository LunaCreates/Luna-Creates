import stateManager from './stateManager';

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
    const target = event.target as HTMLInputElement;

    if (target.getAttribute('data-map')?.match(/size|frame/)) {
      const size = form?.querySelector('[data-map="size"]:checked');
      const frame = form?.querySelector('[data-map="frame"]:checked');
      const input = form?.querySelector(`[data-frame="${frame?.id}"][data-size="${size?.id}"]`);

      if (input) {
        stateManager.variantChanged(input as HTMLInputElement);
      }

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
