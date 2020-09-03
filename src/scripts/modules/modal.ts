import pubSub from './pubSub';

function Modal(modal: HTMLElement) {
  const closeModalButton: HTMLButtonElement | null = modal.querySelector('[data-close-modal]');
  const focusableElements: HTMLElement[] = Array.from(modal.querySelectorAll('a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'));

  let previousFocusedElement: HTMLElement | null = null;

  function setFocusToElement(element: HTMLElement | null) {
    if (element && element.focus) {
      element.focus();
    }
  }

  function closeModal() {
    modal.setAttribute('hidden', '');
    setFocusToElement(previousFocusedElement);
    document.body.removeEventListener('keydown', handleKey);
    pubSub.publish('modal/closed', modal);
  }

  function handleKey(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function openModal(currentTarget: HTMLButtonElement) {
    modal.removeAttribute('hidden');
    previousFocusedElement = currentTarget;
    setFocusToElement(focusableElements[0]);
    document.body.addEventListener('keydown', handleKey);
  }

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  return {
    openModal
  }
}

export default Modal;
