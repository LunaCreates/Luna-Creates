const { updateCartItems } = require('./utils/updateCartItems')

exports.handler = async (event) => {
  const { cartId, items } = JSON.parse(event.body)

  try {
    console.log('--------------------------------')
    console.log('Updating items to existing cart...')
    console.log('--------------------------------')

    const shopifyResponse = await updateCartItems({
      cartId,
      items,
    })

    return {
      statusCode: 200,
      body: JSON.stringify(shopifyResponse.cartLinesUpdate.cart),
    }
  } catch (error) {
    console.log(error)
  }
}
