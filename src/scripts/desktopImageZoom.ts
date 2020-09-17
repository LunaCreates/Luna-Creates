import pubSub from './modules/pubSub';

function DesktopImageZoom(modal: HTMLElement) {
  const picture: HTMLElement | null = modal.querySelector('[data-product-image]');
  const original = modal.querySelector('[data-product-image]') as HTMLElement;
  const magnified = modal.querySelector('[data-image-zoom]') as HTMLElement;
  let isActive = false;

  function setImageZoomSize() {
    const width = original.getBoundingClientRect().width * 3;
    const height = original.getBoundingClientRect().height * 3;

    magnified.style.width = `${width}px`;
    magnified.style.height = `${height}px`;
  }

  function resizeCallback(entries: Array<ResizeObserverEntry>) {
    entries.forEach((entry: ResizeObserverEntry) => {
      if (entry.contentRect) {
        setImageZoomSize();
      }
    });
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

  function setZoom(x: number, y: number) {
    const bg = magnified.getAttribute('data-bg') as string;

    if (magnified.hasAttribute('data-bg')) {
      magnified.style.backgroundImage = bg;
      magnified.removeAttribute('data-bg');
    }

    if (!isActive) return;

    drawMask(x, y);
  }

  function handleMove(posX: number, posY: number) {
    const top = original.getBoundingClientRect().top;
    const left = original.getBoundingClientRect().left;
    const x = (posX - left) - window.pageXOffset;
    const y = (posY - top) - window.pageYOffset;

    setZoom(x, y);
  }

  function handleStart(posX: number, posY: number) {
    const top = original.getBoundingClientRect().top;
    const left = original.getBoundingClientRect().left;
    const x = (posX - left) - window.pageXOffset;
    const y = (posY - top) - window.pageYOffset;

    isActive = true;
    drawMask(x, y);
  }

  function handleMoveEnd() {
    isActive = false;
    magnified.style.opacity = '0';
  }

  function handleMouseMove(event: MouseEvent) {
    const posX = event.pageX;
    const posY = event.pageY;

    event.preventDefault();

    handleMove(posX, posY);
  }

  function handleMouseStart(event: MouseEvent) {
    const posX = event.pageX;
    const posY = event.pageY;

    magnified.style.display = 'block';

    handleStart(posX, posY);
  }

  function addEventListeners() {
    if (picture === null) return;

    picture.addEventListener('mousemove', handleMouseMove);
    picture.addEventListener('mousedown', handleMouseStart, { passive: true });
    picture.addEventListener('mouseup', handleMoveEnd, { passive: true });
  }

  function changeImageZoomSrc(picture: HTMLElement) {
    const image = picture.style.backgroundImage;

    console.log(image, 'gjidffijhifjhg');

    console.log(!image || !magnified, 'magnified.style.backgroundImage');

    magnified.style.backgroundImage = image;
    magnified.setAttribute('data-bg', image);
  }

  function init() {
    const resizeObserver = new ResizeObserver(resizeCallback);

    if (picture === null) return;

    setImageZoomSize();
    addEventListeners();
    changeImageZoomSrc(picture);
    resizeObserver.observe(original);
    pubSub.subscribe('main/product/image/changed', changeImageZoomSrc);
  }

  return {
    init
  }
}

export default DesktopImageZoom;
