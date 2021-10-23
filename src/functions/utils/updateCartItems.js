const { postToShopify } = require('./postToShopify')

/**
 * @param {string} cartId - Target cart to update
 * @param items - Line items of cart to update
 */
exports.updateCartItems = async ({ cartId, items }) => {
  try {
    const shopifyResponse = postToShopify({
      query: `
        mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              id
              lines(first: 10) {
                edges {
                  node {
                    id
                    quantity
                    attributes {
                      key
                      value
                    }
                    merchandise {
                      ... on ProductVariant {
                        id
                      }
                    }
                  }
                }
              }
              estimatedCost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalTaxAmount {
                  amount
                  currencyCode
                }
                totalDutyAmount {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
        lines: items,
      },
    })

    return shopifyResponse
  } catch (error) {
    console.log(error)
  }
}
