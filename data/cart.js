export const cart = [];

export function addToCart(productId) {
    let matchingItem;
  
    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
  
    if (matchingItem) {
      matchingItem.quantity += +document.querySelector(`.js-quantity-selector-${productId}`).value
    } else {
      cart.push({
        productId,
        quantity: +document.querySelector(`.js-quantity-selector-${productId}`).value
      });
    }
  }