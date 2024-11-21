import { cart, calculateCartQuantity } from "../../data/cart.js"
import { deliveryOptions } from "../../data/deliveryOptions.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";


export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let totalBeforeTax = 0;
  let totalOrder = 0;

  cart.forEach((cartItem) => {
    products.forEach((product) => {
      if (product.id === cartItem.productId) {
        productPriceCents += (product.priceCents * cartItem.quantity);
      }
    })
    deliveryOptions.forEach((option) => {
      if (option.id === cartItem.deliveryOptionId) {
        shippingPriceCents += option.priceCents;
      }
    })
  })
  totalBeforeTax = formatCurrency(productPriceCents + shippingPriceCents);
  totalOrder = (totalBeforeTax * 1.1).toFixed(2);



document.querySelector('.js-payment-summary')
.innerHTML =
  `
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${calculateCartQuantity()}):</div>
        <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
      </div>

      <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
      </div>

      <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">$${totalBeforeTax}</div>
      </div>

      <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money">$${(totalBeforeTax*0.1).toFixed(2)}</div>
      </div>

      <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money">$${totalOrder}</div>
      </div>

      <button class="place-order-button button-primary">
        Place your order
      </button>
    `
  }
