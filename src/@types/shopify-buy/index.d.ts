declare module 'shopify-buy' {
  interface ProductHelpers {
    variantForOptions(product: ShopifyBuy.Product, options: ShopifyBuy.Option): ProductVariant
  }

  interface Variant {
    id: string,
    image: {
      altText: string,
      src: string
    },
    priceV2: {
      amount: string,
      currencyCode: string
    }
  }

  interface CustomAttributes {
    attrs: {
      key: {
        value: string
      },
      value: {
        value: string
      }
    }
  }

  interface Products {
    id: FormDataEntryValue,
    quantity: number
  }

  interface CheckoutResource extends ShopifyBuy.CheckoutResource {
    updateLineItems(checkoutId: string, productToRemove: Array<Products>)
  }

  interface ProductResource extends ShopifyBuy.ProductResource {
    helpers: ProductHelpers
  }

  interface Cart extends ShopifyBuy.Cart {
    webUrl: string
  }

  interface LineItem extends ShopifyBuy.LineItem {
    customAttributes: Array<CustomAttributes>,
    variant: Variant
  }
}
