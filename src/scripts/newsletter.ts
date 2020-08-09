function Newsletter(form: HTMLFormElement) {
  function setStatusMessage(response: Response) {
    const errorMessage: HTMLElement | any = form.querySelector('[data-form-error]');
    const successMessage: HTMLElement | any = form.querySelector('[data-form-success]');

    if (response.status === 200) {
      successMessage.style.display = 'block';
    } else {
      errorMessage.style.display = 'block';
    }
  }

  async function handleSubmit(event: Event) {
    const target = event.target as HTMLFormElement;
    const data = { email: target.email.value };

    event.preventDefault();

    await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(setStatusMessage);
  }

  function init() {
    if (form !== null) {
      form.addEventListener('submit', handleSubmit);
    }
  }

  return {
    init
  }
}

export default Newsletter;
