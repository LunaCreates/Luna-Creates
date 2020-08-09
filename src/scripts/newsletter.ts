function Newsletter(form: HTMLFormElement) {
  async function handleSubmit(event: Event) {
    const target = event.target as HTMLFormElement;
    const data = { email: target.email.value };

    event.preventDefault();

    const response = await fetch(form.action, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log(response.json(), 'handleSubmit');
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
