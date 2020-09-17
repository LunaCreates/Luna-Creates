import pubSub from './modules/pubSub';

function ProductMainImage(picture: HTMLPictureElement) {
  const sources: Array<HTMLSourceElement> = Array.from(picture.querySelectorAll('source'));
  const image: HTMLImageElement | null = picture.querySelector('img');

  function changeSource(source: HTMLSourceElement | HTMLImageElement, imagePath: string) {
    const regex = /([a-zA-Z0-9\.:\/\-_]+?_)(\d{1,4}x\d{1,4})(\.png|\.jpg)/;
    const srcSet = source.getAttribute('data-srcset') as string;
    const sizes = srcSet.split(/(\d{1,4}x\d{1,4})/g);
    const lowRes = imagePath.split(', ')[0];
    const highRes = imagePath.split(', ')[1];
    const lowResMatch = lowRes.match(regex) as RegExpMatchArray;
    const highResMatch = highRes.match(regex) as RegExpMatchArray;
    const newSrcSet = `${lowResMatch[1]}${sizes[1]}${lowResMatch[3]} 1x, ${highResMatch[1]}${sizes[3]}${highResMatch[3]} 2x`;

    if (srcSet === newSrcSet) return;

    source.setAttribute('srcset', newSrcSet);
    source.setAttribute('data-srcset', newSrcSet);
  }

  function changeMainProductImage(element: HTMLPictureElement) {
    const elementImage: HTMLImageElement | null = element.querySelector('[data-component="product-thumbnails"] img');
    const imagePath: string | null | undefined = elementImage?.getAttribute('data-main-image');

    if (image && imagePath) {
      sources.forEach(source => changeSource(source, imagePath));
      changeSource(image, imagePath);
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
