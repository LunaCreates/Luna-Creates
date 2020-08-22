import checkout from './shopify/checkout';

if ('loading' in HTMLImageElement.prototype) {
  const images: Array<HTMLImageElement> = Array.from(document.querySelectorAll('img.lazyload'));
  const sources: Array<HTMLSourceElement> = Array.from(document.querySelectorAll('[data-srcset'));

  images.forEach((img: HTMLImageElement) => {
    img.srcset = img.dataset.srcset as string;
    img.classList.remove('lazyload');
  });

  sources.forEach((source: HTMLSourceElement) => {
    source.srcset = source.dataset.srcset as string;
  });
} else {
  import('lazysizes')
}

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

checkout().init();

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "quotes-carousel" */ 'Src/scripts/triggerSearch')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Trigger Search - ${err}`));
}, document.querySelectorAll('[data-component="search"]'));

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "navigation" */ 'Src/scripts/navigation')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Navigation - ${err}`));
}, document.querySelectorAll('[data-component="navigation"]'));

import(/* webpackChunkName: "swRegister" */ 'Src/scripts/swRegister').then(initModule).catch(err => console.error(`Error in: swRegister - ${err}`));

observe((element: HTMLTableElement) => {
  import(/* webpackChunkName: "cart" */ 'Src/scripts/cart')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Cart - ${err}`));
}, document.querySelectorAll('[data-component="cart"]'));

observe((element: HTMLInputElement) => {
  import(/* webpackChunkName: "search" */ 'Src/scripts/search')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Search - ${err}`));
}, document.querySelectorAll('[data-search-input]'));

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "faqs-accordion" */ 'Src/scripts/faqsAccordion')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: FAQs Accordion - ${err}`));
}, document.querySelectorAll('[data-component="faqs"]'));

/** *****
 *
 *  Image Zoom
 *
 * ******* */

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "image-zoom" */ 'Src/scripts/imageZoom')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Image Zoom - ${err}`));
}, document.querySelectorAll('[data-component="product-image-zoom"]'));

/** *****
 *
 *  Forms
 *
 * ******* */

observe((element: HTMLFormElement) => {
  import(/* webpackChunkName: "form-validation" */ 'Src/scripts/formValidation')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Form Validation - ${err}`));
}, document.querySelectorAll('[data-component="contact-form"]'));

observe((element: HTMLFormElement) => {
  import(/* webpackChunkName: "newsletter" */ 'Src/scripts/newsletter')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Newsletter - ${err}`));
}, document.querySelectorAll('[data-component="newsletter"]'));

// Carousels
// glide js is imported in them all but webpack splits it out into a seprate bundle then includes it when needed.

observe((carousel: HTMLElement) => {
  import(/* webpackChunkName: "product-main-image" */ 'Src/scripts/productMainImage')
    .then(module => initModule(module, carousel))
    .catch(err => console.error(`Error in: Product Main Image - ${err}`));
}, document.querySelectorAll('[data-component="product-picture"]'));

observe((carousel: HTMLElement) => {
  import(/* webpackChunkName: "product-thumbnails" */ 'Src/scripts/productThumbnailsCarousel')
    .then(module => initModule(module, carousel))
    .catch(err => console.error(`Error in: Product Thumbnails - ${err}`));
}, document.querySelectorAll('[data-component="product-thumbnails-carousel"]'));

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "product-thumbnails" */ 'Src/scripts/productThumbnails')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Product Thumbnails - ${err}`));
}, document.querySelectorAll('[data-component="product-thumbnails"]'));

function resizeCallback(entries: Array<ResizeObserverEntry>) {
  entries.forEach((entry: ResizeObserverEntry) => {
    const width = entry.contentRect.width;

    if (width < 768) {
      resizeObserver.disconnect();

      observe((carousel: HTMLElement) => {
        import(/* webpackChunkName: "quotes-carousel" */ 'Src/scripts/quotesCarousel')
          .then(module => initModule(module, carousel))
          .catch(err => console.error(`Error in: Quotes Carousel - ${err}`));
      }, document.querySelectorAll('[data-component="quotes"]'));
    }
  });
}

const resizeObserver = new ResizeObserver(resizeCallback);
resizeObserver.observe(document.body);

// Shopify

const pathname = window.location.pathname;
const isProductPage = pathname.includes('/products/') && !pathname.endsWith('/products/');

if (isProductPage) {
  const product = document.querySelector('[data-component="product-details"]');
  import(/* webpackChunkName: "shopify" */ 'Src/scripts/shopify/shopify')
    .then(module => initModule(module, product))
    .catch(err => console.error(`Error in: Shopify - ${err}`));
}

export {};
