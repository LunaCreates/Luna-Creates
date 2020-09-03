import pubSub from './modules/pubSub';

function ImageZoom(product: HTMLElement) {
  const button: HTMLButtonElement | null = product.querySelector('[data-image-zoom]');
  const modal: HTMLElement | null = product.querySelector('[data-modal="image-zoom"]');

  function showImageZoomModal(module: any) {
    const imageZoomModal = module.default;

    if (modal === null) return;

    imageZoomModal(modal).openModal(button);
  }

  function runDesktopImageZoom(module: any) {
    const desktopImageZoom = module.default;

    desktopImageZoom(modal).init();
  }

  function handleResizeEntry(entry: ResizeObserverEntry) {
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    if (isTouchDevice) {
      console.log('Touch device');
    } else {
      import('./desktopImageZoom').then(runDesktopImageZoom);
    }
  }

  function resizeCallback(entries: Array<ResizeObserverEntry>) {
    entries.forEach(handleResizeEntry);
  }

  function handleImageZoom() {
    const resiveObserve = new ResizeObserver(resizeCallback);
    resiveObserve.observe(document.body);
  }

  function handleClick() {
    if (button === null) return;

    import('./modules/modal')
      .then(showImageZoomModal)
      .then(handleImageZoom);
  }

  function changeImageZoomSrc(picture: HTMLPictureElement) {
    const imagePath = picture.querySelector('img')?.srcset.split('_75x75')[0] as string;
    const image = modal?.querySelector('[data-product-image]') as HTMLImageElement;

    if (image === null && imagePath === undefined) return;

    image.srcset = `${imagePath}.jpg`;
  }

  function init() {
    if (button === null) return;

    button.addEventListener('click', handleClick);
    pubSub.subscribe('main/product/image/changed', changeImageZoomSrc);
  }

  return {
    init
  }
}

export default ImageZoom;
