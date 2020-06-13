declare module 'shopify-buy' {
  export interface Helpers {
    variantForOptions(product: ShopifyBuy.Product, options: ShopifyBuy.Option): ProductVariant
  }

  export interface ProductResource extends ShopifyBuy.ProductResource {
    helpers: Helpers
  }

  interface Client extends ShopifyBuy.Client {
    product: ProductResource;
  }
}
