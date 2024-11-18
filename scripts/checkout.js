import { cart, removeFromCart, calculateCartQuantity, saveToStorage } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";

let cartSummary = "";

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  })

  cartSummary += `   <div class="cart-item-container js-cart-container-${productId}">
          <div class="delivery-date">
            Delivery date: Wednesday, June 15
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image" src="${matchingProduct.image}">

            <div class="cart-item-details">
              <div class="product-name">
              ${matchingProduct.name}
              </div>
              <div class="product-price">
              $${formatCurrency(matchingProduct.priceCents)}
              </div>
              <div class="product-quantity">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${productId}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${cartItem.productId}">
                  Update
                </span>
                <input class="quantity-input quantity-input-${cartItem.productId}">
                <span class="save-quantity-link link-primary" data-product-id="${cartItem.productId}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${cartItem.productId}"> 
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>

              <div class="delivery-option">
                <input type="radio" class="delivery-option-input" name="delivery-option-${cartItem.productId}">
                <div>
                  <div class="delivery-option-date">
                    Tuesday, June 21
                  </div>
                  <div class="delivery-option-price">
                    FREE Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" checked class="delivery-option-input" name="delivery-option-${cartItem.productId}">
                <div>
                  <div class="delivery-option-date">
                    Wednesday, June 15
                  </div>
                  <div class="delivery-option-price">
                    $4.99 - Shipping
                  </div>
                </div>
              </div>
              <div class="delivery-option">
                <input type="radio" class="delivery-option-input" name="delivery-option-${cartItem.productId}">
                <div>
                  <div class="delivery-option-date">
                    Monday, June 13
                  </div>
                  <div class="delivery-option-price">
                    $9.99 - Shipping
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummary;
})

function updateCartQuantity() {
  document.querySelector('.js-return-to-home-link').innerHTML = `${calculateCartQuantity()} items`;
}

updateCartQuantity();


const deleteButton = document.querySelectorAll('.js-delete-link');
deleteButton.forEach((button) => {
  button.addEventListener("click", () => {
    const productId = button.dataset.productId;
    removeFromCart(productId);
    updateCartQuantity();
  })
})

const updateButton = document.querySelectorAll(".js-update-link");
updateButton.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    document.querySelector(`.js-cart-container-${productId}`).classList.add("is-editing-quantity");
  })
})

const saveButton = document.querySelectorAll(".save-quantity-link");
saveButton.forEach((button) => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;

    let matchingItem;

    cart.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    if (+document.querySelector(`.quantity-input-${productId}`).value > 0) {
      matchingItem.quantity = +document.querySelector(`.quantity-input-${productId}`).value;
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = matchingItem.quantity;
      document.querySelector(`.js-cart-container-${productId}`).classList.remove("is-editing-quantity");
    } else {
      removeFromCart(productId);
    }
    updateCartQuantity();
    saveToStorage();
  })
})
