const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function buildImage(image) {
  const imageSrc = image.originalSrc.split('.jpg')[0];
  const imageAlt = image.altText;

  return `
    <picture class="cart__picture">
      <img class="cart__image" src="${imageSrc}_100x100.jpg" alt="${imageAlt}" width="100" height="100" loading="lazy" />
    </picture>
  `;
}

function renderAttributes(attribute) {
  const key = attribute.key;
  const value = attribute.value;

  return `<small class="cart__table-options"><strong>${key}</strong>: ${value}</small>`
}

function renderCartItem(item, index) {
  const attributes = item.node.customAttributes;
  const price = parseInt(item.node.variant.priceV2.amount, 10);
  const total = price * item.node.quantity;
  const variantId = item.node.variant.id;

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
        <input type="text" id="variant-${index}" name="variant" value="${variantId}" class="cart__variant">

        <label class="cart__label" for="quantity-${index}">Quantity</label>
        <input type="number" id="quantity-${index}" name="quantity" value="${item.node.quantity}" min="1" class="cart__quantity" pattern="[0-9]*">
      </td>
      <td>&pound;${total.toFixed(2)}</td>
      <td>
        <button class="cart__remove" type="button" aria-label="Remove item" data-variant-id="${variantId}">
          <svg class="cart__icon" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <path d="M4 10v20c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10H4zm6 18H8V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zM26.5 4H20V1.5c0-.825-.675-1.5-1.5-1.5h-7c-.825 0-1.5.675-1.5 1.5V4H3.5C2.675 4 2 4.675 2 5.5V8h26V5.5c0-.825-.675-1.5-1.5-1.5zM18 4h-6V2.025h6V4z"/>
          </svg>
        </button>
      </td>
    </tr>
  `;

  return html;
}

function renderImage(image) {
  return `<img src="${image.image}" class="cart__preview-image" role="presentation" data-image-id="${image.id}" />`
}

function renderKeyMapImages(keyMapImages) {
  if (keyMapImages && keyMapImages.length > 0) {
    return `
      <p class="cart__preview-title" aria-hidden="true">Map preview:</p>
      ${keyMapImages.map(renderImage).join('')}
    `;
  }

  return ''
}

function renderTableData(data) {
  const { keyMapImages, checkoutData } = data;
  const lineItems = checkoutData.lineItems.edges;
  const subtotal = parseInt(checkoutData.subtotalPriceV2.amount, 10);
  const checkoutUrl = checkoutData.webUrl;

  return `
    <div class="cart__inner">
        <table class="cart__table">
            <thead class="cart__table-head">
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Option</th>
                </tr>
            </thead>

            <tbody class="cart__table-body">
              ${lineItems.map(renderCartItem).join('')}
            </tbody>
        </table>
    </div>

    <div class="cart__footer">
      <div class="cart__preview-images">
        ${renderKeyMapImages(keyMapImages)}
      </div>
      <div class="cart__content">
        <p class="cart__subtotal"><strong>Subtotal:</strong> &pound;${subtotal.toFixed(2)}</p>
        <p class="cart__shipping">Shipping &amp; taxes calculated at checkout</p>

        <div class="cart__buttons">
            <button type="submit" class="cart__update">Update Cart</button>
            <a href="${checkoutUrl}" class="cart__checkout">Checkout</a>
        </div>
      </div>
    </div>
  `;
}

function renderNoItemsData() {
  return `
    <div class="cart__no-items">
      <p class="cart__body">Your cart is currently empty.</p>
      <a class="cart__button" href="/products/">Continue shopping</a>
    </div>
  `;
}

exports.handler = async function (event, context, callback) {
  try {
    const data = JSON.parse(event.body);
    const hasLineItems = data.checkoutData.lineItems.edges.length > 0;
    const body = hasLineItems ? renderTableData(data) : renderNoItemsData();

    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify(body)
    }

    callback(null, response);
  } catch (error) {
    const response = {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    }

    callback(null, response);
    console.log(error);
  }
}
