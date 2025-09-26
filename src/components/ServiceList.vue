<template>
  <div class="service-list">
    <div class="header">
      <button @click="goBack" class="back-button">
        ← Back to categories
      </button>
      <h2 v-if="category">Services - {{ category.name }}</h2>
      <h2 v-else>Services</h2>
    </div>

    <div v-if="loading" class="loading">
      Loading services...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div v-if="!loading && services.length > 0" class="services-grid">
      <div 
        v-for="service in services" 
        :key="service.id"
        class="service-card"
      >
        <div class="service-info">
          <h3>{{ service.name }}</h3>
          <p class="service-description">{{ service.description }}</p>
          
          <div class="price-info">
            <span class="original-price" :class="{ 'discounted': hasDiscount(service) }">
              €{{ service.price.toFixed(2) }}
            </span>
            <span v-if="hasDiscount(service)" class="discount-price">
              €{{ getDiscountedPrice(service).toFixed(2) }}
            </span>
          </div>
          
          <div v-if="hasDiscount(service)" class="discount-info">
            <span class="discount-badge">
              -{{ Math.round(getDiscountPercentage(service)) }}%
            </span>
          </div>
        </div>

        <div class="service-actions">
          <div class="quantity-controls" v-if="isInCart(service.id)">
            <button @click="decreaseQuantity(service.id)" class="quantity-btn">-</button>
            <span class="quantity">{{ getCartQuantity(service.id) }}</span>
            <button @click="increaseQuantity(service.id)" class="quantity-btn">+</button>
          </div>
          
          <button 
            @click="addToCart(service)" 
            class="add-to-cart-btn"
            :class="{ 'in-cart': isInCart(service.id) }"
          >
            {{ isInCart(service.id) ? 'In cart' : 'Add to cart' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="!loading && services.length === 0" class="empty-state">
      No services available in this category.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'
import { useCartStore } from '@/stores/cart'
import type { Service, Category } from '@/types'

const route = useRoute()
const router = useRouter()
const servicesStore = useServicesStore()
const cartStore = useCartStore()

const loading = ref(false)
const error = ref<string | null>(null)

const categoryId = computed(() => Number(route.params.categoryId))

const category = computed(() => 
  servicesStore.getCategoryById(categoryId.value)
)

const services = computed(() => 
  category.value?.services || []
)

function hasDiscount(service: Service): boolean {
  const categoryRules = category.value ? servicesStore.getRulesForCategory(category.value.name) : []
  const serviceRules = servicesStore.getRulesForService(service.name)
  return categoryRules.length > 0 || serviceRules.length > 0
}

function getDiscountedPrice(service: Service): number {
  if (!hasDiscount(service)) return service.price
  
  const categoryRules = category.value ? servicesStore.getRulesForCategory(category.value.name) : []
  const serviceRules = servicesStore.getRulesForService(service.name)
  
  // Service rules take priority over category rules
  const rules = serviceRules.length > 0 ? serviceRules : categoryRules
  
  let discountedPrice = service.price
  
  // Apply discount rules - could probably optimize this loop
  for (const rule of rules) {
    if (rule.type === 'percentage' || !rule.type) {
      discountedPrice = service.price * (1 - rule.discount)
    } else if (rule.type === 'fixed') {
      discountedPrice = Math.max(0, service.price - rule.discount)
    }
  }
  
  return discountedPrice
}

function getDiscountPercentage(service: Service): number {
  if (!hasDiscount(service)) return 0
  const original = service.price
  const discounted = getDiscountedPrice(service)
  return ((original - discounted) / original) * 100
}

function isInCart(serviceId: number): boolean {
  return !!cartStore.getItemByServiceId(serviceId)
}

function getCartQuantity(serviceId: number): number {
  const item = cartStore.getItemByServiceId(serviceId)
  return item?.quantity || 0
}

function addToCart(service: Service) {
  cartStore.addItem(service, 1)
}

function increaseQuantity(serviceId: number) {
  cartStore.increaseQuantity(serviceId)
}

function decreaseQuantity(serviceId: number) {
  cartStore.decreaseQuantity(serviceId)
}

function goBack() {
  router.push({ name: 'home' })
}

async function loadData() {
  try {
    loading.value = true
    error.value = null
    
    // Load data if not already loaded
    if (servicesStore.categories.length === 0) {
      await servicesStore.loadAllData()
    }
    
    // Check if category exists
    if (!category.value) {
      console.warn('Category not found:', categoryId.value)
      error.value = 'Category not found'
      return
    }
    
  } catch (err) {
    console.error('Failed to load category data:', err)
    error.value = err instanceof Error ? err.message : 'Loading error'
  } finally {
    loading.value = false
  }
}

watch(() => categoryId.value, loadData)

onMounted(loadData)
</script>

<style scoped>
.service-list {
  padding: 20px;
}

.header {
  margin-bottom: 30px;
}

.back-button {
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #007bff;
  color: white;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
}

.loading {
  background-color: #f0f0f0;
  color: #666;
}

.error {
  background-color: #ffe6e6;
  color: #d63031;
  border: 1px solid #ff7675;
}

.empty-state {
  background-color: #f8f9fa;
  color: #6c757d;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.service-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  transition: box-shadow 0.3s ease;
}

.service-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-info h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.3em;
}

.service-description {
  color: #666;
  margin-bottom: 15px;
  font-size: 0.9em;
  line-height: 1.4;
}

.price-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.original-price {
  font-size: 1.2em;
  font-weight: bold;
  color: #333;
}

.original-price.discounted {
  text-decoration: line-through;
  color: #999;
  font-size: 1em;
  font-weight: normal;
}

.discount-price {
  font-size: 1.3em;
  font-weight: bold;
  color: #28a745;
}

.discount-info {
  margin-bottom: 15px;
}

.discount-badge {
  background-color: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: bold;
}

.service-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
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

.add-to-cart-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-to-cart-btn:hover {
  background-color: #0056b3;
}

.add-to-cart-btn.in-cart {
  background-color: #28a745;
}

.add-to-cart-btn.in-cart:hover {
  background-color: #1e7e34;
}

h2 {
  color: #333;
  margin: 0;
}
</style>
