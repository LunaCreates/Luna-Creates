function Accordion(element: HTMLElement, className: string) {
  function insertButtonHtml(heading: HTMLElement) {
    const id: string | null = heading.getAttribute('data-accordion-heading');
    const headingText: string | null = heading.textContent;

    const buttonHtml = `
      <button type="button" class="${className}__button" aria-expanded="false" data-accordion-button="${id}">
        ${headingText}

        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="${className}__icon" aria-hidden="true"><path d="M7.41 8.59003L12 13.17L16.59 8.59003L18 10L12 16L6 10L7.41 8.59003Z"></path></svg>
      </button>
    `;

    heading.innerHTML = buttonHtml;
  }

  function hideSection(section: HTMLElement) {
    section.setAttribute('hidden', '');
  }

  function insertButtons(element: HTMLElement) {
    const headings: HTMLElement[] = Array.from(element.querySelectorAll('[data-accordion-heading]'));
    const sectionsToHide: HTMLElement[] = Array.from(element.querySelectorAll('[data-accordion-panel]'));

    headings.forEach(insertButtonHtml);
    sectionsToHide.forEach(hideSection);
  }

  function togglePanelExpansion(button: HTMLButtonElement) {
    const targetId = button.getAttribute('data-accordion-button') as string;
    const isExpanded = button.getAttribute('aria-expanded') as string === 'true';
    const panel = element.querySelector(`[id=${targetId}]`) as HTMLElement;

    button.setAttribute('aria-expanded', `${isExpanded ? 'false' : 'true'}`);

    if (isExpanded) {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
    }
  }

  function setPanelFocusUpOrDown(buttons: HTMLButtonElement[], event: KeyboardEvent) {
    let focusIndex: number;

    if (event.code === 'Home') {
      focusIndex = 0;
    } else if (event.code === 'End') {
      focusIndex = buttons.length - 1;
    } else {
      const currentIndex = buttons.indexOf(event.target as HTMLButtonElement);
      const direction = (event.code === 'ArrowDown') ? 1 : -1;

      focusIndex = (currentIndex + buttons.length + direction) % buttons.length;
    }

    buttons[focusIndex].focus();
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLElement;

    if (target.nodeName === 'BUTTON') {
      togglePanelExpansion(target as HTMLButtonElement);
    }
  }

  function handleKeyUpEvent(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    const nodeName = target.nodeName as string;
    const currentTarget = event.currentTarget as HTMLElement;
    const keyCode: string = event.code;
    const buttons: HTMLButtonElement[] = Array.from(currentTarget.querySelectorAll('[data-accordion-button]'));

    if (nodeName === 'BUTTON' && keyCode.match(/ArrowUp|ArrowDown|Home|End/)) {
      setPanelFocusUpOrDown(buttons, event);
    }
  }

  function preventScroll(event: KeyboardEvent) {
    if (event.code.match(/ArrowUp|ArrowDown|Home|End/)) {
      event.preventDefault();
    }
  }

  function init() {
    insertButtons(element);
    element.addEventListener('click', handleClickEvent);
    element.addEventListener('keyup', handleKeyUpEvent);
    element.addEventListener('keydown', preventScroll);
  }

  return {
    init
  };
}

export default Accordion;
