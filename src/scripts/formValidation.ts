function FormValidation(form: HTMLFormElement) {
  const inputs: NodeListOf<HTMLInputElement> = document.querySelectorAll('[data-input]');
  const textarea: HTMLTextAreaElement | any = document.querySelector('[data-textarea]');
  const submitButton: HTMLButtonElement | any = document.querySelector('[data-submit-button]');
  const errorMessage: HTMLElement | any = document.querySelector('[data-form-error]');
  const successMessage: HTMLElement | any = document.querySelector('[data-form-success]');

  // TODO: Tidy this up

  function getInputPattern(input: any) {
    const pattern = input.getAttribute('pattern');
    const regex = RegExp(pattern);

    return new RegExp(regex, 'i').test(input.value);
  }

  function validateInput(event: any) {
    const element = event.currentTarget || event;
    const isValid = getInputPattern(element);
    const validationMessage = element.nextElementSibling;

    element.classList.remove('border-grey-border');

    if (isValid && element.value.length !== 0) {
      element.classList.remove('border-danger');
      element.classList.add('border-success');
      validationMessage.classList.remove('opacity-100');
      return;
    }

    element.classList.add('border-danger');
    element.classList.remove('border-success');
    validationMessage.classList.add('opacity-100');
  }

  function validateTextarea(event: any) {
    const element = event.currentTarget || event;
    const isNotEmpty = element.value.length !== 0;
    const validationMessage = element.nextElementSibling;

    element.classList.remove('border-grey-border');

    if (isNotEmpty) {
      element.classList.remove('border-danger');
      element.classList.add('border-success');
      validationMessage.classList.remove('opacity-100');
      return;
    }

    element.classList.add('border-danger');
    element.classList.remove('border-success');
    validationMessage.classList.add('opacity-100');
  }

  function showSuccessMessage() {
    successMessage.style.display = 'block';
  }

  function showErrorMessage() {
    errorMessage.style.display = 'block';
  }

  function submitForm() {
    const formData: any = new FormData(form);
    const url: string | any = form.getAttribute('action');

    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/x-www-form-urlencoded;charset=UTF-8',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams(formData).toString()
    })
      .then(showSuccessMessage)
      .catch(showErrorMessage);
  }

  function validateAllFields(event: Event) {
    let firstErrorFound = false;

    event.preventDefault();

    inputs.forEach(input => {
      validateInput(input);

      if (input.classList.contains('border-danger') && !firstErrorFound) {
        input.focus();
        firstErrorFound = true;
      }
    });

    validateTextarea(textarea);

    if (textarea.classList.contains('border-danger') && !firstErrorFound) {
      textarea.focus();
      firstErrorFound = true;
    }

    if (!firstErrorFound) {
      submitForm();
    }
  }

  function init() {
    if (form !== null) {
      inputs.forEach(input => input.addEventListener('change', validateInput));
      textarea.addEventListener('change', validateTextarea);
      submitButton.addEventListener('click', validateAllFields);
    }
  }

  return {
    init
  }
}

export default FormValidation;
