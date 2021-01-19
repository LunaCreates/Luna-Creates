import pubSub from '../modules/pubSub';

function KeyMap(product: HTMLElement) {
  const modal: HTMLDialogElement | null = product.querySelector('[data-modal="key-map"]');
  const keyMapContainer: HTMLElement | null = product.querySelector('[data-key-map]');

  function showKeyMapModal(module: any, target: HTMLButtonElement) {
    const keyMapModal = module.default;

    keyMapModal(modal).openModal(target);
  }

  function handleKeyMapModal(target: HTMLButtonElement) {
    import('../modules/modal')
      .then(module => showKeyMapModal(module, target));
  }

  function renderKeyMapImage(keyMap: string) {
    const keyMapImage = `<img src="${keyMap}" class="w-auto max-h-10 mx-auto" alt="Preview image of personalised key map">`;

    if (!keyMapContainer) return;

    keyMapContainer.className = 'relative mb-24 border-1 border-solid border-transparent';
    keyMapContainer.innerHTML =  keyMapImage;
  }

  function resetKeyMapContainer() {
    if (!keyMapContainer) return;

    keyMapContainer.className = 'relative ratio-4-1 mb-24 border-1 border-solid border-tertiary';
    keyMapContainer.innerHTML = '<p class="absolute top-1/2 left-0 w-full max-w-18 px-8 text-base leading-base text-tertiary text-center transform -translate-y-1/2 md:left-1/2 md:px-24 md:-translate-x-1/2 md:-translate-y-1/2">Please wait a moment while your key loads…</p>';
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
