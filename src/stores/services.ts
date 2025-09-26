import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { dataService } from '@/services/dataService'
import type { Category, Service, PriceRule } from '@/types'

export const useServicesStore = defineStore('services', () => {
  // State
  const categories = ref<Category[]>([])
  const services = ref<Service[]>([])
  const priceRules = ref<PriceRule[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const getCategoryById = computed(() => {
    return (id: number) => categories.value.find(cat => cat.id === id)
  })

  const getServiceById = computed(() => {
    return (id: number) => services.value.find(service => service.id === id)
  })

  const getServicesByCategory = computed(() => {
    return (categoryId: number) => {
      const category = categories.value.find(cat => cat.id === categoryId)
      return category?.services || []
    }
  })

  const getRulesForService = computed(() => {
    return (serviceName: string) => {
      return priceRules.value.filter(rule => rule.service === serviceName)
    }
  })

  const getRulesForCategory = computed(() => {
    return (categoryName: string) => {
      return priceRules.value.filter(rule => rule.category === categoryName)
    }
  })

  // Actions
  async function loadCategories() {
    try {
      loading.value = true
      error.value = null
      categories.value = await dataService.getAllCategories()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading categories'
      console.error('Error loadCategories:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadServices() {
    try {
      loading.value = true
      error.value = null
      services.value = await dataService.getAllServices()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading services'
      console.error('Error loadServices:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadPriceRules() {
    try {
      loading.value = true
      error.value = null
      priceRules.value = await dataService.getPriceRules()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading price rules'
      console.error('Error loadPriceRules:', err)
    } finally {
      loading.value = false
    }
  }

  async function loadAllData() {
    try {
      loading.value = true
      error.value = null
      
      const promises = [
        loadCategories(),
        loadServices(), 
        loadPriceRules()
      ]
      
      await Promise.all(promises)
      // console.log('All data loaded successfully') 
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error loading data'
      console.error('Error loadAllData:', err)
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    categories,
    services,
    priceRules,
    loading,
    error,
    
    // Getters
    getCategoryById,
    getServiceById,
    getServicesByCategory,
    getRulesForService,
    getRulesForCategory,
    
    // Actions
    loadCategories,
    loadServices,
    loadPriceRules,
    loadAllData,
    clearError
  }
})
