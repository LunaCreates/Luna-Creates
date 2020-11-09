// import shopify from './modules/shopify';
import { KeyMapProps } from './shopify/basket'

type ImageTypes = {
  originalSrc: string,
  altText: string
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function Cart(form: HTMLFormElement) {
  const cart = localStorage.getItem('cart');

  function buildImage(image: ImageTypes) {
    const imageSrc = image.originalSrc.split('.jpg')[0];
    const imageAlt = image.altText;

    return `
      <picture class="cart__picture">
        <img class="cart__image" src="${imageSrc}_100x100.jpg" alt="${imageAlt}" width="100" height="100" loading="lazy" />
      </picture>
    `
  }

  function renderAttributes(attribute: any) {
    const key = attribute.key;
    const value = attribute.value;

    return `<small class="cart__table-options"><strong>${key}</strong>: ${value}</small>`
  }

  function renderCartItem(item: any, index: number) {
    const attributes = item.node.customAttributes;
    const price = parseInt(item.node.variant.priceV2.amount, 10);
    const total = price * item.node.quantity;
    const keyMapId = item.node.variant.id;
    const productId = item.node.id;

    const html = `
      <tr>
        <th class="cart__table-product">
          ${buildImage(item.node.variant.image)}
          <div class="cart__table-content">
            <span class="cart__table-title">${item.node.title}</span>
            ${attributes.map(renderAttributes).join('')}
          </div>
        </th>
        <td>&pound;${price.toFixed(2)}</td>
        <td>
          <input type="text" id="variant-${index}" name="variant" value="${item.id}" class="cart__variant">

          <label class="cart__label" for="quantity-${index}">Quantity</label>
          <input type="number" id="quantity-${index}" name="quantity" value="${item.node.quantity}" min="1" class="cart__quantity" pattern="[0-9]*">
        </td>
        <td>&pound;${total.toFixed(2)}</td>
        <td>
          <button class="cart__remove" type="button" aria-label="Remove item" data-product-id="${productId}" data-key-map-id="${keyMapId}">
            <svg class="cart__icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path d="M4 10v20c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10H4zm6 18H8V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zM26.5 4H20V1.5c0-.825-.675-1.5-1.5-1.5h-7c-.825 0-1.5.675-1.5 1.5V4H3.5C2.675 4 2 4.675 2 5.5V8h26V5.5c0-.825-.675-1.5-1.5-1.5zM18 4h-6V2.025h6V4z"/>
            </svg>
          </button>
        </td>
      </tr>
    `

    return html;
  }

  function renderImage(image: KeyMapProps) {
    return `<img src="${image.image}" class="cart__preview-image" role="presentation" data-image-id="${image.id}" />`
  }

  function renderKeyMapImages() {
    const images = JSON.parse(localStorage.getItem('mapPreviews') as string);

    if (images && images.length > 0) {
      return `
        <p class="cart__preview-title">Map preview:</p>
        ${images.map(renderImage).join('')}
      `;
    }

    return ''
  }

  function renderTableData(lineItems: any) {
    form.innerHTML = `
      <div class="cart__inner">
          <table class="cart__table">
              <thead class="cart__table-head">
                  <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                  </tr>
              </thead>

              <tbody class="cart__table-body">
                ${lineItems.map(renderCartItem).join('')}
              </tbody>
          </table>
      </div>

      <div class="cart__footer">
        <div class="cart__preview-images">
          ${renderKeyMapImages()}
        </div>
        <div class="cart__content">
          <p class="cart__subtotal"><strong>Subtotal:</strong> &pound;SUBTOTAL</p>
          <p class="cart__shipping">Shipping &amp; taxes calculated at checkout</p>

          <div class="cart__buttons">
              <button type="submit" class="cart__update">Update</button>
              <button class="cart__checkout" data-checkout>Checkout</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderNoItemsData() {
    form.outerHTML = `
      <div class="cart__no-items">
        <p class="cart__body">Your cart is currently empty.</p>
        <a class="cart__button" href="/products/">Continue shopping</a>
      </div>
    `
  }

  function updateCartItems(data: any) {
    const lineItems = data.lineItems.edges;

    localStorage.setItem('shopify', JSON.stringify(data));
    (lineItems.length > 0) ? renderTableData(lineItems) : renderNoItemsData();
  }

  function updateLocalCart(data: any) {
    const lineItems = data.lineItems.edges;
    const lineItemsToAdd = lineItems.map((item: any) => {
      const customAttributes = item.node.customAttributes;
      const variantId = item.node.variant.id;
      const quantity = item.node.quantity;

      return { customAttributes, variantId, quantity }
    })

    localStorage.setItem('cart', JSON.stringify(lineItemsToAdd));
  }

  function removeKeyMapImage(keyMapId: string) {
    const images = JSON.parse(localStorage.getItem('mapPreviews') as string);

    if (images && images.length > 0) {
      const newImages = images.filter((image: KeyMapProps) => image.id !== keyMapId);

      localStorage.setItem('mapPreviews', JSON.stringify(newImages));
    }
  }

  async function fetchShopifyData(productId: string) {
    const checkoutData = JSON.parse(localStorage.getItem('shopify') as string);
    const checkoutId = checkoutData.id;
    const lineItems = checkoutData.lineItems.edges;
    const body = { checkoutId, lineItems, productId };
    const checkout = await fetch('/.netlify/functions/checkout-delete', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const response = await checkout.json();
    return response.data.checkoutLineItemsReplace.checkout;
  }

  async function removeProductItem(target: HTMLButtonElement) {
    const keyMapId = target.getAttribute('data-key-map-id') as string;
    const productId = target.getAttribute('data-product-id') as string;
    const data = await fetchShopifyData(productId);

    updateCartItems(data);
    updateLocalCart(data);
    // removeKeyMapImage(keyMapId);
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLElement;

    if (target.hasAttribute('data-product-id')) {
      removeProductItem(target as HTMLButtonElement);
    }
  }

  function formatLineItems(variant: FormDataEntryValue, index: number, quantities: Array<FormDataEntryValue>) {
    const quantity = quantities[index] as string;

    return { id: variant, quantity: parseFloat(quantity) };
  }

  function handleSubmitEvent(event: Event) {
    const formData = new FormData(event.target as HTMLFormElement);
    const variants = formData.getAll('variant');
    const quantities = formData.getAll('quantity');
    const items = variants.map((v, i) => formatLineItems(v, i, quantities));

    event.preventDefault();
  }

  async function init() {
    const checkout = await fetch('/.netlify/functions/checkout-create', {
      method: 'POST',
      headers,
      body: cart
    });
    const response = await checkout.json();
    const checkoutData = response.data.checkoutCreate.checkout;

    updateCartItems(checkoutData);

    form.addEventListener('click', handleClickEvent);
    form.addEventListener('submit', handleSubmitEvent);
  }

  return {
    init
  }
}

export default Cart;
