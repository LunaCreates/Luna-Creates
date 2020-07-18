import GlideModule from './modules/glide';

function ProductThumbnailsCarousel(carousel: HTMLElement) {
  const options = {
    perView: 4,
    bound: true,
    breakpoints: {
      768: {
        gap: 10
      }
    }
  };
  const newCarousel = GlideModule(carousel, options);

  function init() {
    newCarousel.init();
  }

  return {
    init
  };
}

export default ProductThumbnailsCarousel;
