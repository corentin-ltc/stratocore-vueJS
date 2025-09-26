<template>
  <div class="cart">
    <h2>My Cart</h2>

    <div v-if="cartStore.isEmpty" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/" class="continue-shopping-btn">
        Continue shopping
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div 
          v-for="item in cartStore.items" 
          :key="item.service.id"
          class="cart-item"
        >
          <div class="item-info">
            <h3>{{ item.service.name }}</h3>
            <p class="item-description">{{ item.service.description }}</p>
            
            <div class="price-details">
              <div class="unit-price">
                <span class="label">Unit price:</span>
                <span class="original-price" :class="{ 'discounted': item.discountedPrice }">
                  €{{ item.originalPrice.toFixed(2) }}
                </span>
                <span v-if="item.discountedPrice" class="discount-price">
                  €{{ item.discountedPrice.toFixed(2) }}
                </span>
              </div>
              
              <div v-if="item.appliedRules && item.appliedRules.length > 0" class="applied-rules">
                <span class="rules-label">Applied discounts:</span>
                <div class="rules-list">
                  <span 
                    v-for="rule in item.appliedRules" 
                    :key="`${rule.category || rule.service}-${rule.discount}`"
                    class="rule-tag"
                  >
                    {{ formatRule(rule) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="item-controls">
            <div class="quantity-controls">
              <button @click="cartStore.decreaseQuantity(item.service.id)" class="quantity-btn">
                -
              </button>
              <span class="quantity">{{ item.quantity }}</span>
              <button @click="cartStore.increaseQuantity(item.service.id)" class="quantity-btn">
                +
              </button>
            </div>

            <div class="item-total">
              <span class="total-label">Total:</span>
              <span class="total-price">
                €{{ ((item.discountedPrice || item.originalPrice) * item.quantity).toFixed(2) }}
              </span>
            </div>

            <button 
              @click="cartStore.removeItem(item.service.id)" 
              class="remove-btn"
              title="Remove from cart"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>€{{ cartStore.totalOriginalPrice.toFixed(2) }}</span>
        </div>
        
        <div v-if="cartStore.totalSavings > 0" class="summary-row savings">
          <span>Savings:</span>
          <span>-€{{ cartStore.totalSavings.toFixed(2) }}</span>
        </div>
        
        <div class="summary-row total">
          <span>Total:</span>
          <span>€{{ cartStore.totalDiscountedPrice.toFixed(2) }}</span>
        </div>

        <div class="cart-actions">
          <button @click="cartStore.clearCart" class="clear-cart-btn">
            Clear cart
          </button>
          
          <button @click="proceedToCheckout" class="checkout-btn">
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import type { PriceRule } from '@/types'

const cartStore = useCartStore()
const router = useRouter()

// Format discount rules for display - maybe could be cleaner but works
function formatRule(rule: PriceRule): string {
  let discount
  if (rule.type === 'percentage' || !rule.type) {
    discount = `${Math.round(rule.discount * 100)}%`
  } else {
    discount = `€${rule.discount}`
  }
  
  const target = rule.service || rule.category || 'Item'
  return `${target}: -${discount}`
}

function proceedToCheckout() {
  if (cartStore.isEmpty) return
  
  // TODO: Replace with proper checkout modal/page
  const total = cartStore.totalDiscountedPrice.toFixed(2)
  const savings = cartStore.totalSavings.toFixed(2)
  
  alert(`Order confirmed!\n\nTotal: €${total}\nSavings: €${savings}\n\nThank you for your order!`)
  
  cartStore.clearCart() // Clear after successful order
  router.push('/') // Back to home
}
</script>

<style scoped>
.cart {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.empty-cart {
  text-align: center;
  padding: 60px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-cart p {
  color: #6c757d;
  font-size: 1.1em;
  margin-bottom: 20px;
}

.continue-shopping-btn {
  display: inline-block;
  background-color: #007bff;
  color: white;
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.continue-shopping-btn:hover {
  background-color: #0056b3;
}

.cart-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

/* Tablet breakpoint */
@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 20px; /* Reduce gap on smaller screens */
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: white;
}

@media (max-width: 600px) {
  .cart-item {
    flex-direction: column;
    gap: 15px;
  }
}

.item-info {
  flex: 1;
  margin-right: 20px;
}

.item-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.2em;
}

.item-description {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.9em;
}

.price-details {
  margin-bottom: 10px;
}

.unit-price {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.label {
  color: #666;
  font-size: 0.9em;
}

.original-price {
  font-weight: bold;
  color: #333;
}

.original-price.discounted {
  text-decoration: line-through;
  color: #999;
  font-weight: normal;
}

.discount-price {
  font-weight: bold;
  color: #28a745;
}

.applied-rules {
  margin-top: 8px;
}

.rules-label {
  color: #666;
  font-size: 0.85em;
  display: block;
  margin-bottom: 4px;
}

.rules-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.rule-tag {
  background-color: #e9ecef;
  color: #495057;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75em;
}

.item-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  min-width: 120px;
}

@media (max-width: 600px) {
  .item-controls {
    align-items: stretch;
    flex-direction: row;
    justify-content: space-between;
  }
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all .3s ease;
}

.quantity-btn:hover {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.quantity {
  font-weight: bold;
  min-width: 20px;
  text-align: center;
}

.item-total {
  text-align: right;
}

.total-label {
  color: #666;
  font-size: 0.9em;
  display: block;
}

.total-price {
  font-weight: bold;
  color: #333;
  font-size: 1.1em;
}

.remove-btn {
  background-color: #dc3545;
  color: white;
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
  /* Make sure it's always circular */
  flex-shrink: 0;
}

.remove-btn:hover {
  background-color: #c82333;
}

.cart-summary {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  position: sticky;
  top: 20px;
  height: fit-content; /* Prevents unnecessary stretching */
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 5px 0;
}

.summary-row.savings {
  color: #28a745;
  font-weight: 500;
}

.summary-row.total {
  border-top: 2px solid #ddd;
  padding-top: 15px;
  margin-top: 15px;
  font-weight: bold;
  font-size: 1.2em;
}

.cart-actions {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clear-cart-btn, .checkout-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.clear-cart-btn {
  background-color: #6c757d;
  color: white;
}

.clear-cart-btn:hover {
  background-color: #545b62;
}

.checkout-btn {
  background-color: #28a745;
  color: white;
  font-size: 1.1em;
}

.checkout-btn:hover {
  background-color: #1e7e34;
}
</style>
