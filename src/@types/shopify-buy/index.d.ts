declare module 'shopify-buy' {
  interface ProductHelpers {
    variantForOptions(product: ShopifyBuy.Product, options: ShopifyBuy.Option): ProductVariant
  }

  interface ProductResource extends ShopifyBuy.ProductResource {
    helpers: ProductHelpers
  }
}
