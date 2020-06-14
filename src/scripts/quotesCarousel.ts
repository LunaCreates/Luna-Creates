import GlideModule from './modules/glide.ts';

function QuotesCarousel(carousel: HTMLElement) {
  const option = { adjustHeight: true }
  const newCarousel = GlideModule(carousel, option);
  const track = carousel.querySelector('[data-glide-el]') as HTMLElement;

  function resizeCallback(entries: any) {
    entries.forEach((entry: ResizeObserverEntry) => {
      const width = entry.contentRect.width;

      if (newCarousel.slider && width >= 768) {
        newCarousel.slider.destroy();
        track.style.height = 'auto';
      }

      if (width < 768) {
        newCarousel.init();
      }
    });
  }

  function init() {
    const resizeObserver = new ResizeObserver(resizeCallback);

    resizeObserver.observe(document.body);
  }

  return {
    init
  };
}

export default QuotesCarousel;
