import shopify from './modules/shopify';
import checkout from './shopify/checkout';

type ImageTypes = {
  src: string,
  altText: string
}

function Cart(form: HTMLFormElement) {
  const checkoutId = localStorage.getItem('shopify_checkout_id');

  function buildImage(image: ImageTypes) {
    const imageSrc = image.src.split('.jpg')[0];
    const imageAlt = image.altText;

    return `
      <picture class="cart__picture">
        <img class="cart__image" src="${imageSrc}_100x100.jpg" alt="${imageAlt}" width="100" height="100" loading="lazy" />
      </picture>
    `
  }

  function renderCartItem(item: ShopifyBuy.LineItem, index: number) {
    const options = item.customAttributes[0].attrs;
    const price = parseInt(item.variant.priceV2.amount, 10);
    const total = price * item.quantity;
    const html = `
      <tr>
        <th class="cart__table-product">
          ${buildImage(item.variant.image)}
          <div class="cart__table-content">
            <span class="cart__table-title">${item.title}</span>
            <small class="cart__table-options">${options.key.value}: ${options.value.value}</small>
          </div>
        </th>
        <td>&pound;${price.toFixed(2)}</td>
        <td>
          <input type="text" id="variant-${index}" name="variant" value="${item.id}" class="cart__variant">

          <label class="cart__label" for="quantity-${index}">Quantity</label>
          <input type="number" id="quantity-${index}" name="quantity" value="${item.quantity}" min="1" class="cart__quantity" pattern="[0-9]*">
        </td>
        <td>&pound;${total.toFixed(2)}</td>
        <td>
          <button class="cart__remove" type="button" aria-label="Remove item" data-product-id="${item.id}">
            <svg class="cart__icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <path d="M4 10v20c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10H4zm6 18H8V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zM26.5 4H20V1.5c0-.825-.675-1.5-1.5-1.5h-7c-.825 0-1.5.675-1.5 1.5V4H3.5C2.675 4 2 4.675 2 5.5V8h26V5.5c0-.825-.675-1.5-1.5-1.5zM18 4h-6V2.025h6V4z"/>
            </svg>
          </button>
        </td>
      </tr>
    `

    return html;
  }

  function updateCartItems(checkout: ShopifyBuy.Cart) {
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
                ${checkout.lineItems.map(renderCartItem).join('')}
              </tbody>
          </table>
      </div>

      <p class="cart__subtotal"><strong>Subtotal:</strong> &pound;${checkout.subtotalPrice}</p>
      <p class="cart__shipping">Shipping &amp; taxes calculated at checkout</p>

      <div class="cart__buttons">
          <button type="submit" class="cart__update">Update</button>
          <a href="${checkout.webUrl}" class="cart__checkout">Checkout</a>
      </div>
    `;
  }

  function removeProductItem(target: HTMLButtonElement) {
    const productToRemove: Array<string> = [];
    const productId = target.getAttribute('data-product-id') as string;

    productToRemove.push(productId);

    if (checkoutId === null) return;

    shopify.checkout.removeLineItems(checkoutId, productToRemove)
      .then(() => window.location.pathname = '/cart/');
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

    shopify.checkout.updateLineItems(checkoutId, items)
      .then(() => window.location.pathname = '/cart/');
  }


  function init() {
    if (checkoutId === null) return;

    checkout().init();
    shopify.checkout.fetch(checkoutId).then(updateCartItems);
    form.addEventListener('click', handleClickEvent);
    form.addEventListener('submit', handleSubmitEvent);
  }

  return {
    init
  }
}

export default Cart;
