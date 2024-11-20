import { cart, removeFromCart, calculateCartQuantity, saveToStorage, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { deliveryOptions } from "../data/deliveryOptions.js";

const today = dayjs();
const deliveryDate = today.add(7, "day");
console.log(deliveryDate.format("dddd, MMMM D"));

function renderOrderSummary() {

  let cartSummary = "";

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProduct;

    products.forEach((product) => {
      if (product.id === productId) {
        matchingProduct = product;
      }
    })

    const deliveryOptionId = cartItem.deliveryOptionId;
    let numberOfDays;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        numberOfDays = option.deliveryDays;
      }
    })

    const dateString = today.add(numberOfDays, "day").format("dddd, MMMM D");

    cartSummary += `   <div class="cart-item-container js-cart-container-${productId}">
          <div class="delivery-date">
            Delivery date: ${dateString}
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
              ${deliveryOptionsHTML(cartItem)}
            </div>
          </div>
        </div>`


    function deliveryOptionsHTML(cartItem) {
      let html = "";
      deliveryOptions.forEach((deliveryOption) => {
        const dateString = today.add(deliveryOption.deliveryDays, "day").format("dddd, MMMM D");
        const priceString = deliveryOption.priceCents === 0
          ? "FREE"
          : `$${formatCurrency(deliveryOption.priceCents)} -`;

        const isChecked = deliveryOption.id === cartItem.deliveryOptionId
          ? "checked"
          : "";

        html += `
      <div class="delivery-option js-delivery-option" data-product-id="${cartItem.productId}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked} class="delivery-option-input" name="delivery-option-${cartItem.productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
      })
      return html;
    }

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

  deliveryOptions.forEach((delivery) => {

  })

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const { productId, deliveryOptionId } = element.dataset;
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
    });
  });
};

renderOrderSummary();
