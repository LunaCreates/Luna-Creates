import pubSub from '../modules/pubSub';

function KeyMap(product: HTMLElement) {
  const modal: HTMLDialogElement | null = product.querySelector('[data-key-map-modal]');
  const keyMapContainer: HTMLElement | null = product.querySelector('[data-key-map]');

  function showKeyMapModal(module: any, currentTarget: HTMLButtonElement) {
    const keyMapModal = module.default;

    keyMapModal(modal).openModal(currentTarget);
  }

  function handleKeyMapModal(target: HTMLButtonElement) {
    import('../modules/modal')
      .then(module => showKeyMapModal(module, target));
  }

  function renderKeyMapImage(keyMap: string) {
    const keyMapImage = `<img src="${keyMap}" class="modal__key-map-image" alt="Preview image of personalised key map">`;

    keyMapContainer?.classList.add('modal__key-map--active');
    keyMapContainer?.insertAdjacentHTML('afterbegin', keyMapImage);
  }

  function resetKeyMapContainer() {
    if (!keyMapContainer) return

    keyMapContainer.classList.remove('modal__key-map--active');
    keyMapContainer.innerHTML = '';
  }

  function init() {
    if (modal && keyMapContainer) {
      pubSub.subscribe('show/key/map/modal', handleKeyMapModal);
      pubSub.subscribe('key/map/created', renderKeyMapImage);
      pubSub.subscribe('modal/closed', resetKeyMapContainer);
    }
  }

  return {
    init
  }
}

export default KeyMap;
