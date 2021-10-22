import postData from './modules/postData';

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
  import('lazysizes');
}

const html: HTMLElement | null = document.querySelector('html');

if (html) html.className = 'js';

getCartSummaryDetails();

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

// fetch cart data from the API
function getCartSummaryDetails() {
  if (localStorage.getItem('shopifyCartId')) {
    postData('/api/get-cart', {
      'cartId': localStorage.getItem('shopifyCartId')
    })
      .then(data => {
        if (data.cart) {
          displayCartSummaryDetails(data.cart.id);
        }
        else {
          //clear a local cart if it has expired with Shopify
          localStorage.removeItem('shopifyCartId');
        }
      });
  } else {
    console.log(`No shopping cart yet`);
  }
}

// Update the UI with latest cart info
function displayCartSummaryDetails(id: string) {
  const cartLink: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('[data-cart]');

  if (cartLink.length > 0) {
    cartLink.forEach((link: HTMLAnchorElement) => link.href = `/cart/?cartId=${id}`);
  }
}

/** *****
 *
 *  Critical - All pages need them as fast as possible
 *
 * ******* */

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "cartQuantity" */ 'Src/scripts/shopify/cartQuantity')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Cart Quantity - ${err}`));

  import(/* webpackChunkName: "trigger-search" */ 'Src/scripts/triggerSearch')
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
}, document.querySelectorAll('[data-component="product-details"]'));

/** *****
 *
 *  More Toggle
 *
 * ******* */

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "more-toggle" */ 'Src/scripts/moreToggle')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: More Toggle - ${err}`));
}, document.querySelectorAll('[data-component="more-toggle"]'));

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


/** *****
 *
 *  Product Main Image & Thumbnails
 *
 * ******* */

observe((carousel: HTMLElement) => {
  import(/* webpackChunkName: "product-main-image" */ 'Src/scripts/productMainImage')
    .then(module => initModule(module, carousel))
    .catch(err => console.error(`Error in: Product Main Image - ${err}`));
}, document.querySelectorAll('[data-component="product-picture"]'));

observe((element: HTMLElement) => {
  import(/* webpackChunkName: "product-thumbnails" */ 'Src/scripts/productThumbnails')
    .then(module => initModule(module, element))
    .catch(err => console.error(`Error in: Product Thumbnails - ${err}`));
}, document.querySelectorAll('[data-component="product-thumbnails"]'));


/** *****
 *
 *  Shopify
 *
 * ******* */

const pathname = window.location.pathname;
const isProductPage = pathname.includes('/products/') && !pathname.endsWith('/products/');

if (isProductPage) {
  const shopifyCartId = localStorage.getItem('shopifyCartId') || '';
  const form: HTMLFormElement | null = document.querySelector('[data-product-form]');
  const shopifyCartIdInput = form?.elements.namedItem('cartId');
  const product = document.querySelector('[data-component="product-details"]');

  if (shopifyCartIdInput && shopifyCartIdInput instanceof HTMLInputElement) {
    shopifyCartIdInput.value = shopifyCartId
  }

  import(/* webpackChunkName: "shopify" */ 'Src/scripts/shopify/shopify')
    .then(module => initModule(module, product))
    .catch(err => console.error(`Error in: Shopify - ${err}`));
}

export {};
