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

  export interface CheckoutCreate {
    customAttributes: CustomAttribute[],
    quantity: number,
    variantId: string
  }

  export interface ImageTypes {
    originalSrc: string,
    altText: string
  }
}

declare module "shopify-storefront" {
  export = ShopifyStorefront;
}
