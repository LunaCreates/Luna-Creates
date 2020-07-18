import pubSub from './modules/pubSub';

function ProductMainImage(picture: HTMLPictureElement) {
  const sources: Array<HTMLSourceElement> = Array.from(picture.querySelectorAll('source'));
  const image: HTMLImageElement | null = picture.querySelector('img');

  function changeSource(source: HTMLSourceElement, imagePath: string) {
    const srcSet = source.getAttribute('data-srcset') as string;
    const path = imagePath.split(/[0-9]\d\dx[0-9]\d\d\.jpg/g)[0];
    const newSrcSet = srcSet.replace(/([a-zA-Z0-9:\/\._-]+?_)+/g, path);

    if (srcSet === newSrcSet) return;

    source.setAttribute('srcset', newSrcSet);
    source.setAttribute('data-srcset', newSrcSet);
  }

  function changeImageSrc(image: HTMLImageElement, imagePath: string) {
    const srcSet = image.getAttribute('data-srcset') as string;
    const path = imagePath.split(/[0-9]\d\dx[0-9]\d\d\.jpg/g)[0];
    const newSrcSet = srcSet.replace(/([a-zA-Z0-9:\/\._-]+?_)+/g, path);

    if (srcSet === newSrcSet) return;

    image.setAttribute('srcset', newSrcSet);
    image.setAttribute('data-srcset', newSrcSet);
  }

  function changeMainProductImage(element: HTMLPictureElement) {
    const elementImage: HTMLImageElement | null = element.querySelector('img');
    const imagePath: string | null | undefined = elementImage?.getAttribute('data-srcset');

    if (image && imagePath) {
      sources.forEach(source => changeSource(source, imagePath));
      changeImageSrc(image, imagePath);
    }
  }

  function init() {
    pubSub.subscribe('main/product/image/changed', changeMainProductImage);
  }

  return {
    init
  };
}

export default ProductMainImage;
