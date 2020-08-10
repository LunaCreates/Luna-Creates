import pubSub from './modules/pubSub';

function ImageZoom(element: HTMLElement) {
  const original: HTMLElement | null = element.querySelector('[data-product-image]');
  const magnified: HTMLElement | null = element.querySelector('[data-image-zoom]');

  function setPerc(direction: number, measurement: number) {
    let percentage = (direction / measurement) * 100;

    if (direction >= 0.01 * measurement) {
      percentage += 0.15 * percentage;
    }

    return percentage;
  }

  function handleMouseMove(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    const width = original ? original.clientWidth : 0;
    const height = original ? original.clientHeight : 0;

    if (!magnified) return;

    magnified.style.backgroundPositionX = `${setPerc(x, width) - 9}%`;
    magnified.style.backgroundPositionY = `${setPerc(y, height) - 9}%`;
    magnified.style.left = `${x - 50}px`;
    magnified.style.top = `${y - 50}px`;
  }

  function changeImageZoomSrc(picture: HTMLPictureElement) {
    const image = picture.querySelector('img')?.srcset.split('300x300');

    if (!image || !magnified) return;

    magnified.style.backgroundImage = `url(${image[0]}1200x1200.jpg)`;
  }

  function init() {
    if (element !== null) {
      element.addEventListener('mousemove', handleMouseMove, false);
      pubSub.subscribe('main/product/image/changed', changeImageZoomSrc);
    }
  }

  return {
    init
  }
}

export default ImageZoom;
