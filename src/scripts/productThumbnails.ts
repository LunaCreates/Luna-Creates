import pubSub from './modules/pubSub';

function ProductThumbnails(element: HTMLElement) {
  function sendPubSubMessage(element: HTMLAnchorElement) {
    const picture = element.querySelector('picture') as HTMLPictureElement;

    pubSub.publish('main/product/image/changed', picture);
  }

  function setActiveThumbnail(link: HTMLAnchorElement) {
    const currentActiveLink: HTMLAnchorElement | null = element.querySelector('.product__thumbnail-link--active');

    if (currentActiveLink === null) return;

    currentActiveLink.classList.remove('product__thumbnail-link--active');
    link.classList.add('product__thumbnail-link--active');
  }

  function handleClickEvent(event: Event) {
    const target = event.target as Element;

    if (target.hasAttribute('data-thumbnail-link')) {
      event.preventDefault();
      sendPubSubMessage(target as HTMLAnchorElement);
      setActiveThumbnail(target as HTMLAnchorElement);
    }
  }

  function init() {
    element.addEventListener('click', handleClickEvent);
  }

  return {
    init
  };
}

export default ProductThumbnails;
