const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function buildImage(image) {
  const imageSrc = image.originalSrc.split('.jpg')[0];
  const imageAlt = image.altText;

  return `
    <picture class="cart__picture pos-r dp-b bgc-fade mr-16 md:mr-24">
      <img class="pos-a top-0 right-0 bottom-0 left-0 h-full of-cover" src="${imageSrc}_100x100.jpg" alt="${imageAlt}" width="100" height="100" loading="lazy" />
    </picture>
  `;
}

function renderAttributes(attribute) {
  const key = attribute.key;
  const value = attribute.value;

  return `<small class="cart__table-options fs-xs lh-xs fvs-md dp-b fst-italic"><strong>${key}</strong>: ${value}</small>`
}

function renderCartItem(item, index, arr) {
  const attributes = item.node.customAttributes;
  const price = parseInt(item.node.variant.priceV2.amount, 10);
  const total = price * item.node.quantity;
  const variantId = item.node.variant.id;
  const lastItem = arr.length === index + 1;
  const border = lastItem ? 'bort-1-solid-neutral borb-1-solid-neutral' : 'bort-1-solid-neutral';

  const html = `
    <tr class="${border}">
      <th class="ta-left dp-f ai-c minw-250 py-16 pr-16 md:py-24 md:pr-24">
        ${buildImage(item.node.variant.image)}
        <div>
          <span class="fs-xs lh-xs fvs-rg">${item.node.title}</span>
          ${attributes.map(renderAttributes).join('')}
        </div>
      </th>
      <td class="fs-xs lh-xs fvs-rg text-body px-16 md:px-32">&pound;${price.toFixed(2)}</td>
      <td class="s-xs lh-xs fvs-rg text-body px-16 md:px-32">
        <input type="text" id="variant-${index}" name="variant" value="${variantId}" class="dp-n">

        <label class="sr-only" for="quantity-${index}">Quantity</label>
        <input type="number" id="quantity-${index}" name="quantity" value="${item.node.quantity}" min="1" class="py-8 px-16 text-heading fs-base lh-base fvs-rg w-60px" pattern="[0-9]*">
      </td>
      <td class="s-xs lh-xs fvs-rg text-body px-16 md:px-32">&pound;${total.toFixed(2)}</td>
      <td class="px-16 md:px-32">
        <button class="cart__remove bor-1-solid-body text-body" type="button" aria-label="Remove item" data-variant-id="${variantId}">
          <svg class="cart__icon p-16 pe-none" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
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
      <p class="gcsp-full ta-left mb-0" aria-hidden="true">Map preview:</p>
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
    <div class="mb-32 ovx-auto">
        <table class="minw-600 md:w-full">
            <thead>
                <tr>
                    <th class="fs-xs lh-xs fvs-rg pb-16 text-body ta-left md:pb-24">Product</th>
                    <th class="fs-xs lh-xs fvs-rg pb-16 text-body md:pb-24">Price</th>
                    <th class="fs-xs lh-xs fvs-rg pb-16 text-body md:pb-24">Quantity</th>
                    <th class="fs-xs lh-xs fvs-rg pb-16 text-body md:pb-24">Total</th>
                    <th class="pb-16 op-0 text-body md:pb-24">Option</th>
                </tr>
            </thead>

            <tbody>
              ${lineItems.map(renderCartItem).join('')}
            </tbody>
        </table>
    </div>

    <div class="mb-24 md:dp-g md:gtc-2">
      <div class="dp-g gtc-2 gg-24 mb-24 ai-c">
        ${renderKeyMapImages(keyMapImages)}
      </div>
      <div>
        <p class="mb-8 ta-right"><strong>Subtotal:</strong> &pound;${subtotal.toFixed(2)}</p>
        <p class="fs-xs lh-xs fvs-rg my-0 ta-right fst-italic text-body">Shipping &amp; taxes calculated at checkout</p>

        <div class="dp-f flex-wrap jc-end mt-24">
            <button type="submit" class="bgc-primary text-background fs-xs lh-xs fvs-md py-16 px-24 borr-5 tt-uc ls-1">Update Cart</button>
            <a href="${checkoutUrl}" class="bgc-secondary text-foreground fs-xs lh-xs fvs-md py-16 px-24 borr-5 tt-uc ls-1 ml-24">Checkout</a>
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
