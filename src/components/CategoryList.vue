<template>
  <div class="category-list">
    <h2>Service Categories</h2>
    
    <div v-if="servicesStore.loading" class="loading">
      Loading categories...
    </div>
    
    <div v-if="servicesStore.error" class="error">
      {{ servicesStore.error }}
      <button @click="servicesStore.clearError">Close</button>
    </div>
    
    <div v-if="!servicesStore.loading && servicesStore.categories.length > 0" class="categories-grid">
      <div 
        v-for="category in servicesStore.categories" 
        :key="category.id"
        class="category-card"
        @click="selectCategory(category.id)"
      >
        <h3>{{ category.name }}</h3>
        <p>{{ category.services.length }} service(s) available</p>
        <div class="category-services-preview">
          <span 
            v-for="service in category.services.slice(0, 2)" 
            :key="service.id"
            class="service-preview"
          >
            {{ service.name }}
          </span>
          <span v-if="category.services.length > 2" class="more-services">
            +{{ category.services.length - 2 }} more
          </span>
        </div>
      </div>
    </div>
    
    <div v-if="!servicesStore.loading && servicesStore.categories.length === 0" class="empty-state">
      No categories available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useServicesStore } from '@/stores/services'

const router = useRouter()
const servicesStore = useServicesStore()

function selectCategory(categoryId: number) {
  router.push({ name: 'category-services', params: { categoryId } })
}

onMounted(async () => {
  if (servicesStore.categories.length === 0) {
    await servicesStore.loadAllData()
  }
})
</script>

<style scoped>
.category-list {
  padding: 20px;
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

.error button {
  margin-left: 10px;
  padding: 4px 8px;
  background-color: #d63031;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  background-color: #f8f9fa;
  color: #6c757d;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.category-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: white;
}

.category-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.1);
  transform: translateY(-2px);
}

.category-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
}

.category-card p {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 0.9em;
}

.category-services-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.service-preview {
  background-color: #e9ecef;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
  color: #495057;
}

.more-services {
  background-color: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style>
