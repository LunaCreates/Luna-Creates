import pubSub from './modules/pubSub';

function ProductThumbnails(element: HTMLElement) {
  function sendPubSubMessage(element: HTMLAnchorElement) {
    const picture = element.nextElementSibling as HTMLPictureElement;

    pubSub.publish('main/product/image/changed', picture);
  }

  function setActiveThumbnail(link: HTMLAnchorElement) {
    const currentActiveLink: HTMLAnchorElement | null = element.querySelector('.border-primary');

    if (currentActiveLink === null) return;

    currentActiveLink.classList.remove('border-primary');
    link.classList.add('border-primary');
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLAnchorElement;

    if (target.hasAttribute('data-thumbnail-link')) {
      event.preventDefault();
      target.focus();
      sendPubSubMessage(target);
      setActiveThumbnail(target);
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
