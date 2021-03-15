
function MoreToggle(element: HTMLElement) {
  const elementToToggle = element.querySelector('[data-toggle]') as HTMLElement;

  function setOpenButtonState(button: HTMLButtonElement) {
    button.innerHTML = `
      Show less
      <svg class="product__toggle-icon product__toggle-icon--less" width="24" height="24">
        <use xlink:href="/icons/sprite.svg#chevron"></use>
      </svg>
    `;
  }

  function setClosedButtonState(button: HTMLButtonElement) {
    button.innerHTML = `
      Show more
      <svg class="product__toggle-icon" width="24" height="24">
          <use xlink:href="/icons/sprite.svg#chevron"></use>
      </svg>
    `;
  }

  function triggerToggle(event: Event) {
    const isExpanded = elementToToggle.hasAttribute('data-toggle-open');
    const target = event.target as HTMLButtonElement;

    if (isExpanded) {
      elementToToggle.removeAttribute('data-toggle-open');
      setClosedButtonState(target);
    } else {
      elementToToggle.setAttribute('data-toggle-open', '');
      setOpenButtonState(target);
    }
  }

  function setState() {
    const button: HTMLButtonElement | null = element.querySelector('[data-toggle-more]');

    if (button === null || elementToToggle.scrollHeight < 260) return;

    elementToToggle.className += ` ${elementToToggle.className}--toggle`;
    button.className += ` ${button.className}--visible`;
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
