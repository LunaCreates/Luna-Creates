const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
}

function buildImage(image) {
  const imageSrc = image.originalSrc.split('.jpg')[0];
  const imageAlt = image.altText;

  return `
    <picture class="relative block w-100 h-100 flex-initial bg-grey-fade mr-16 md:mr-24">
      <img class="absolute inset-0 h-full object-cover" src="${imageSrc}_100x100.jpg" alt="${imageAlt}" width="100" height="100" loading="lazy" />
    </picture>
  `;
}

function renderAttributes(attribute) {
  const key = attribute.key;
  const value = key === 'Type' ? `${attribute.value} map` : attribute.value;

  return `<small class="text-xs leading-xs fvs-md block capitalize italic"><strong>${key}</strong>: ${value}</small>`
}

function renderCartItem(item, index, arr) {
  const attributes = item.node.customAttributes;
  const price = parseInt(item.node.variant.priceV2.amount, 10);
  const total = price * item.node.quantity;
  const variantId = item.node.variant.id;
  const lastItem = arr.length === index + 1;
  const border = lastItem ? 'border-t-1 border-b-1 border-solid border-grey-border' : 'border-t-1 border-solid border-grey-border';

  const html = `
    <tr class="${border}">
      <th class="text-left flex items-center min-w-16 py-16 pr-16 md:py-24 md:pr-24">
        ${buildImage(item.node.variant.image)}
        <div class="flex-1">
          <span class="text-xs leading-xs fvs-rg">${item.node.title}</span>
          ${attributes.map(renderAttributes).join('')}
        </div>
      </th>
      <td class="text-xs leading-xs fvs-rg text-grey px-16 md:px-32">&pound;${price.toFixed(2)}</td>
      <td class="text-xs leading-xs fvs-rg text-grey px-16 md:px-32">
        <input type="text" id="variant-${index}" name="variant" value="${variantId}" class="hidden">

        <label class="sr-only" for="quantity-${index}">Quantity</label>
        <input type="number" id="quantity-${index}" name="quantity" value="${item.node.quantity}" min="1" class="py-8 px-16 text-heading text-base leading-base text-grey-neutral fvs-rg w-60 border-1 border-solid border-grey-border rounded-4" pattern="[0-9]*">
      </td>
      <td class="text-xs leading-xs fvs-rg text-grey px-16 md:px-32">&pound;${total.toFixed(2)}</td>
      <td class="px-16 md:px-32">
        <button class="border-1 border-solid border-grey rounded-full text-grey" type="button" aria-label="Remove item" data-variant-id="${variantId}">
          <svg class="p-16 pointer-events-none xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 32 32" fill="currentColor">
            <path d="M4 10v20c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V10H4zm6 18H8V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zm4 0h-2V14h2v14zM26.5 4H20V1.5c0-.825-.675-1.5-1.5-1.5h-7c-.825 0-1.5.675-1.5 1.5V4H3.5C2.675 4 2 4.675 2 5.5V8h26V5.5c0-.825-.675-1.5-1.5-1.5zM18 4h-6V2.025h6V4z"/>
          </svg>
        </button>
      </td>
    </tr>
  `;

  return html;
}

function renderImage(image) {
  return `<img src="${image.image}" class="w-full mx-auto align-middle" role="presentation" data-image-id="${image.id}" />`
}

function renderKeyMapImages(keyMapImages) {
  if (keyMapImages && keyMapImages.length > 0) {
    return `
      <p class="col-span-full text-left mb-0" aria-hidden="true">Map preview:</p>
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
    <div class="mb-32 overflow-x-auto">
        <table class="min-w-38 md:w-full">
            <thead>
                <tr>
                    <th class="text-xs leading-xs fvs-rg pb-16 text-grey text-left md:pb-24">Product</th>
                    <th class="text-xs leading-xs fvs-rg pb-16 text-grey md:pb-24">Price</th>
                    <th class="text-xs leading-xs fvs-rg pb-16 text-grey md:pb-24">Quantity</th>
                    <th class="text-xs leading-xs fvs-rg pb-16 text-grey md:pb-24">Total</th>
                    <th class="pb-16 opacity-0 text-grey md:pb-24">Option</th>
                </tr>
            </thead>

            <tbody>
              ${lineItems.map(renderCartItem).join('')}
            </tbody>
        </table>
    </div>

    <div class="mb-24 md:grid md:grid-cols-2">
      <div class="grid grid-cols-2 gap-24 mb-24 items-center">
        ${renderKeyMapImages(keyMapImages)}
      </div>
      <div>
        <p class="mb-8 text-right"><strong>Subtotal:</strong> &pound;${subtotal.toFixed(2)}</p>
        <p class="text-xs leading-xs fvs-rg my-0 text-right italic text-grey">Shipping &amp; taxes calculated at checkout</p>

        <div class="flex flex-wrap justify-end mt-24">
            <button type="submit" class="bg-primary text-background text-xs leading-xs fvs-md py-16 px-24 rounded-5 uppercase tracking-1 outline-transparent focus:outline-primary hov:hover:bg-foreground md:px-32">Update Cart</button>
            <a href="${checkoutUrl}" class="bg-secondary text-foreground text-xs leading-xs fvs-md py-16 px-24 rounded-5 uppercase tracking-1 ml-24 outline-transparent focus:outline-primary hov:hover:bg-hover-secondary md:px-32">Checkout</a>
        </div>
      </div>
    </div>
  `;
}

function renderNoItemsData() {
  return `
    <div class="mb-24 md:mb-72">
      <p class="text-sm leading-sm fvs-rg text-grey mb-24">Your cart is currently empty.</p>
      <a class="bg-secondary text-foreground text-xs leading-xs fvs-md py-16 px-24 rounded-5 uppercase tracking-1 inline-block self-center outline-transparent focus:outline-primary hov:hover:bg-hover-secondary md:px-32" href="/products/">Continue shopping</a>
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
