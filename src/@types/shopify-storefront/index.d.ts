declare namespace ShopifyStorefront {
  export interface CustomAttribute {
    attrs: {
      key: {
        value: string
      },
      value: {
        value: string
      }
    }
  }

  export interface CheckoutSubtotalPriceV2 {
    amount: string,
    currencyCode?: string
  }

  export interface CheckoutImage {
    altText: string,
    originalSrc: string
  }

  export interface CheckoutVariant {
    id: string,
    image: CheckoutImage,
    priceV2: CheckoutPriceV2
  }

  export interface CheckoutLineitem {
    node: {
      customAttributes: CustomAttribute[],
      id: string,
      quantity: number,
      title: string,
      variant: CheckoutVariant
    }
  }
  export interface CheckoutCreate {
    customAttributes: CustomAttribute[],
    quantity: number,
    variantId: string
  }

  export interface CheckoutData {
    id: string,
    lineItems: {
      edges: CheckoutLineitem[]
    },
    subtotalPriceV2: CheckoutSubtotalPriceV2
    webUrl: string
  }

  export interface ImageTypes {
    originalSrc: string,
    altText: string
  }
}

declare module "shopify-storefront" {
  export = ShopifyStorefront;
}
