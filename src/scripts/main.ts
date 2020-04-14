import 'lazysizes';

const html: HTMLElement | null = document.querySelector('html');

if (html) html.className = 'js';

function initModule(module: any, element: any = null) {
  module.default(element).init();
}

function observe(callback: Function, elements: NodeList) {
  const config = {
    rootMargin: '200px 0px',
    threshold: 0.01
  };

  if (elements.length > 0) {
    const collection: Array<any> = Array.from(elements);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Are we in viewport?
        if (entry.intersectionRatio > 0) {
          // Stop watching and load the script
          observer.unobserve(entry.target);
          callback(entry.target);
        }
      });
    }, config);

    collection.forEach(element => observer.observe(element));
  }
}

/** *****
 *
 *  Critical - All pages need them as fast as possible
 *
 * ******* */

// import(/* webpackChunkName: "swRegister" */ 'Src/scripts/swRegister').then(initModule).catch(err => console.error(`Error in: swRegister - ${err}`));

// Carousels
// glide js is imported in them all but webpack splits it out into a seprate bundle then includes it when needed.

function resizeCallback(entries: Array<any>) {
  entries.forEach(entry => {
    const width = entry.contentRect.width;

    if (width < 768) {
      resizeObserver.disconnect();
      observe((carousel: HTMLElement) => {
        import(/* webpackChunkName: "quotes-carousel" */ 'Src/scripts/quotesCarousel').then(module => initModule(module, carousel))
          .catch(err => console.error(`Error in: Quotes Carousel - ${err}`));
      }, document.querySelectorAll('[data-component="quotes"]'));
    }
  });
}

const resizeObserver = new ResizeObserver(resizeCallback);
resizeObserver.observe(document.body);
