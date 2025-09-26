<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="brand-link">
          <h1>Stratocore Services</h1>
        </router-link>
      </div>

      <div class="nav-actions">
        <router-link to="/cart" class="cart-link">
          <div class="cart-icon-container">
            <span class="cart-icon">🛒</span>
            <!-- Show badge only when there are items -->
            <span 
              v-if="cartStore.itemsCount > 0" 
              class="cart-badge"
            >
              {{ cartStore.itemsCount }}
            </span>
          </div>
          <span class="cart-text">Cart</span>
          <span v-if="cartStore.totalDiscountedPrice > 0" class="cart-total">
            €{{ cartStore.totalDiscountedPrice.toFixed(2) }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

// Get cart store instance
const cartStore = useCartStore()
</script>

<style scoped>
.app-navigation {
  position: sticky;
  top: 0;
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 70px;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5em;
  color: #333;
}

.brand-link {
  text-decoration: none;
  color: inherit;
}

.brand-link:hover h1 {
  color: #007bff;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.cart-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  gap: 8px;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.cart-link:hover {
  background-color: #f8f9fa;
  border-color: #007bff;
}

.cart-link.router-link-active {
  background-color: #007bff;
  color: white;
}

.cart-link.router-link-active .cart-badge {
  background-color: #ffc107;
  color: #333;
}

.cart-icon-container {
  position: relative;
  display: flex;
  align-items: center;
}

.cart-icon {
  font-size: 1.2em;
}

.cart-badge {
  position: absolute;
  right: -8px;
  top: -8px;
  width: 20px;
  height: 20px;
  background: #dc3545;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7em;
  font-weight: bold;
  border: 2px solid white;
}

.cart-text {
  font-weight: 500;
}

.cart-total {
  font-weight: bold;
  color: #28a745;
}

.cart-link.router-link-active .cart-total {
  color: #fff;
}

@media (max-width: 600px) {
  .nav-container {
    padding-left: 15px;
    padding-right: 15px;
  }
  
  .nav-brand h1 {
    font-size: 1.2em;
  }
  
  .cart-text {
    display: none;
  }
  
  .cart-link {
    padding: 8px 12px;
  }
}
</style>
