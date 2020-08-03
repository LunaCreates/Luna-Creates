import pubSub from '../modules/pubSub';

function KeyMap(product: HTMLElement) {
  const modal: HTMLDialogElement | null = product.querySelector('[data-key-map-modal]');
  const keyMapContainer: HTMLElement | null = product.querySelector('[data-key-map]');

  function showKeyMapModal() {
    const basketButton: HTMLButtonElement = modal?.querySelector('[data-add-to-basket]') as HTMLButtonElement;

    modal?.removeAttribute('hidden');
    basketButton.focus();
  }

  function renderKeyMapImage(keyMap: string) {
    const keyMapImage = `<img src="${keyMap}" class="modal__key-map-image" alt="Preview image of personalised key map">`;

    keyMapContainer?.classList.add('modal__key-map--active');
    keyMapContainer?.insertAdjacentHTML('afterbegin', keyMapImage);
  }

  function closeModal() {
    if (!keyMapContainer) return;

    modal?.setAttribute('hidden', '');
    keyMapContainer?.classList.remove('modal__key-map--active');
    keyMapContainer.innerHTML = '';
  }

  function handleClickEvent(event: Event) {
    if (!(event.target instanceof HTMLButtonElement)) return;

    if (event.target.hasAttribute('data-close-modal')) {
      closeModal();
    }
  }

  function handleKeyUpEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  function init() {
    if (modal && keyMapContainer) {
      pubSub.subscribe('show/key/map/modal', showKeyMapModal);
      pubSub.subscribe('key/map/created', renderKeyMapImage);
      modal.addEventListener('click', handleClickEvent);
      modal.addEventListener('keyup', handleKeyUpEvent);
    }
  }

  return {
    init
  }
}

export default KeyMap;
