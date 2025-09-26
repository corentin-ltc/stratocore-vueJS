import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useServicesStore } from './services'
import type { CartItem, Service, PriceRule, Cart } from '@/types'

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([])
  
  // Getters
  const itemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  const totalOriginalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.originalPrice * item.quantity), 0)
  })

  const totalDiscountedPrice = computed(() => {
    return items.value.reduce((total, item) => {
      const price = item.discountedPrice || item.originalPrice
      return total + (price * item.quantity)
    }, 0)
  })

  const totalSavings = computed(() => {
    return totalOriginalPrice.value - totalDiscountedPrice.value
  })

  const cart = computed((): Cart => ({
    items: items.value,
    totalOriginalPrice: totalOriginalPrice.value,
    totalDiscountedPrice: totalDiscountedPrice.value,
    totalSavings: totalSavings.value
  }))

  const isEmpty = computed(() => items.value.length === 0)

  const getItemByServiceId = computed(() => {
    return (serviceId: number) => items.value.find(item => item.service.id === serviceId)
  })

  // Actions
  function calculatePriceWithRules(service: Service, quantity: number): { discountedPrice: number, appliedRules: PriceRule[] } {
    const servicesStore = useServicesStore()
    const appliedRules: PriceRule[] = []
    let discountedPrice = service.price
    
    // Debug: uncomment to log price calculations
    // console.log('Calculating price for:', service.name, 'qty:', quantity)
    
    // Check for service-specific rules first
    const serviceRules = servicesStore.getRulesForService(service.name)
    
    serviceRules.forEach(rule => {
      if (rule.minQuantity && quantity < rule.minQuantity) return
      
      appliedRules.push(rule)
      
      switch (rule.type) {
        case 'percentage':
          discountedPrice = service.price * (1 - rule.discount)
          break
        case 'fixed':
          discountedPrice = Math.max(0, service.price - rule.discount)
          break
        case 'bogo': // Buy One Get One
          // BOGO logic - to be implemented as needed
          if (quantity >= 2) {
            discountedPrice = service.price * (1 - rule.discount)
          }
          break
        default:
          discountedPrice = service.price * (1 - rule.discount)
      }
    })
    
    // Category rules (if no service rules)
    if (serviceRules.length === 0) {
      const category = servicesStore.getCategoryById(service.categoryId || 0)
      if (category) {
        const categoryRules = servicesStore.getRulesForCategory(category.name)
        categoryRules.forEach(rule => {
          if (rule.minQuantity && quantity < rule.minQuantity) return
          
          appliedRules.push(rule)
          
          switch (rule.type) {
            case 'percentage':
              discountedPrice = service.price * (1 - rule.discount)
              break
            case 'fixed':
              discountedPrice = Math.max(0, service.price - rule.discount)
              break
            default:
              discountedPrice = service.price * (1 - rule.discount)
          }
        })
      }
    }
    
    return { discountedPrice: Math.round(discountedPrice * 100) / 100, appliedRules }
  }

  function addItem(service: Service, quantity = 1) {
    const existingItem = items.value.find(item => item.service.id === service.id)
    
    if (existingItem) {
      // Item already exists, just update quantity
      updateQuantity(service.id, existingItem.quantity + quantity)
    } else {
      const { discountedPrice, appliedRules } = calculatePriceWithRules(service, quantity)
      
      const newItem: CartItem = {
        service,
        quantity,
        originalPrice: service.price,
        discountedPrice: discountedPrice !== service.price ? discountedPrice : undefined,
        appliedRules: appliedRules.length > 0 ? appliedRules : undefined
      }
      
      items.value.push(newItem)
    }
  }

  function removeItem(serviceId: number) {
    const index = items.value.findIndex(item => item.service.id === serviceId)
    if (index > -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(serviceId: number, quantity: number) {
    const item = items.value.find(item => item.service.id === serviceId)
    if (item) {
      if (quantity <= 0) {
        removeItem(serviceId)
      } else {
        item.quantity = quantity
        
        // Recalculate prices with new quantities
        const { discountedPrice, appliedRules } = calculatePriceWithRules(item.service, quantity)
        item.discountedPrice = discountedPrice !== item.service.price ? discountedPrice : undefined
        item.appliedRules = appliedRules.length > 0 ? appliedRules : undefined
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function increaseQuantity(serviceId: number) {
    const item = items.value.find(item => item.service.id === serviceId)
    if (item) {
      updateQuantity(serviceId, item.quantity + 1)
    }
  }

  function decreaseQuantity(serviceId: number) {
    const item = items.value.find(item => item.service.id === serviceId)
    if (item) {
      updateQuantity(serviceId, item.quantity - 1)
    }
  }

  // Recalculate all prices when rules change - might be expensive for large carts
  function recalculateAllPrices() {
    // TODO: Consider optimizing this for performance
    items.value.forEach(item => {
      const { discountedPrice, appliedRules } = calculatePriceWithRules(item.service, item.quantity)
      item.discountedPrice = discountedPrice !== item.service.price ? discountedPrice : undefined
      item.appliedRules = appliedRules.length > 0 ? appliedRules : undefined
    })
  }

  return {
    // State
    items,
    
    // Getters
    itemsCount,
    totalOriginalPrice,
    totalDiscountedPrice,
    totalSavings,
    cart,
    isEmpty,
    getItemByServiceId,
    
    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    recalculateAllPrices
  }
})
