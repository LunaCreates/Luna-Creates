import pubSub from './modules/pubSub';

function ImageZoom(element: HTMLElement) {
  const original = element.querySelector('[data-product-image]') as HTMLElement;
  const magnified = element.querySelector('[data-image-zoom]') as HTMLElement;
  let isActive = false;

  function setImageZoomSize() {
    const originalWidth = original.getBoundingClientRect().width * 3;
    const originalHeight = original.getBoundingClientRect().height * 3;

    magnified.style.width = `${originalWidth}px`;
    magnified.style.height = `${originalHeight}px`;
  }

  function drawMask(x: number, y: number) {
    const image = original.getBoundingClientRect();
    const imageZoom = magnified.getBoundingClientRect();
    const propX = x / image.width * imageZoom.width * (1 - 1 / 3) - image.x;
    const propY = y / image.height * imageZoom.height * (1 - 1 / 3) - image.y;
    const maskX = x * 3;
    const maskY = y * 3;
    const clip = `circle(150px at ${maskX}px ${maskY}px)`;

    magnified.style.left = `${-propX}px`;
    magnified.style.top = `${-propY}px`;
    magnified.style.opacity = '1';
    magnified.style.clipPath = clip;
  }

  function handleMouseMove(event: MouseEvent) {
    const top = original.getBoundingClientRect().top;
    const left = original.getBoundingClientRect().left;
    const x = event.clientX - left;
    const y = event.clientY - top;

    if (!isActive) return;

    drawMask(x, y);
  }

  function handleMouseDown(event: MouseEvent) {
    const top = original.getBoundingClientRect().top;
    const left = original.getBoundingClientRect().left;
    const x = event.clientX - left;
    const y = event.clientY - top;

    isActive = true;
    drawMask(x, y);
  }

  function handleMouseUp(event: MouseEvent) {
    isActive = false;
    magnified.style.opacity = '0';
  }

  function addEventListeners() {
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);
  }

  function changeImageZoomSrc(picture: HTMLPictureElement) {
    const image = picture.querySelector('img')?.srcset.split('_300x300');

    if (!image || !magnified) return;

    magnified.style.backgroundImage = `url(${image[0]}.jpg)`;
  }

  function init() {
    if (element !== null) {
      setImageZoomSize();
      addEventListeners();
      pubSub.subscribe('main/product/image/changed', changeImageZoomSrc);
    }
  }

  return {
    init
  }
}

export default ImageZoom;
