function MoreToggle(element: HTMLElement) {
  const elementToToggle = element.querySelector('[data-toggle]') as HTMLElement;

  function setOpenButtonState(button: HTMLButtonElement) {
    button.innerHTML = `
      Show less
      <svg class="ml-8 transform -rotate-90" width="28" height="28">
        <use xlink:href="/icons/sprite.svg#chevron"></use>
      </svg>
    `;
  }

  function setClosedButtonState(button: HTMLButtonElement) {
    button.innerHTML = `
      Show more
      <svg class="ml-8 transform rotate-90" width="28" height="28">
          <use xlink:href="/icons/sprite.svg#chevron"></use>
      </svg>
    `;
  }

  function triggerToggle(event: Event) {
    const isExpanded = elementToToggle.hasAttribute('data-toggle-open');
    const target = event.target as HTMLButtonElement;

    if (isExpanded) {
      elementToToggle.removeAttribute('data-toggle-open');
      elementToToggle.style.height = '250px';
      elementToToggle.classList.remove('after:hidden');
      setClosedButtonState(target);
    } else {
      elementToToggle.setAttribute('data-toggle-open', '');
      elementToToggle.style.height = 'auto';
      elementToToggle.classList.add('after:hidden');
      setOpenButtonState(target);
    }
  }

  function setState() {
    const button: HTMLButtonElement | null = element.querySelector('[data-toggle-more]');

    if (button === null || elementToToggle.scrollHeight < 260) return;

    elementToToggle.style.height = '250px';
    button.addEventListener('click', triggerToggle);
  }

  function init() {
    if (element !== null || elementToToggle !== null) {
      setState();
    }
  }

  return {
    init
  }
}

export default MoreToggle;
