import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CategoryServicesView from '@/views/CategoryServicesView.vue'
import CartView from '@/views/CartView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Home - Service Categories'
      }
    },
    {
      path: '/category/:categoryId',
      name: 'category-services',
      component: CategoryServicesView,
      meta: {
        title: 'Services'
      },
      beforeEnter: (to) => {
        // Validate that categoryId is a number
        const categoryId = Number(to.params.categoryId)
        if (isNaN(categoryId) || categoryId <= 0) {
          return { name: 'home' }
        }
      }
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView,
      meta: {
        title: 'My Cart'
      }
    },
    {
      // Redirect for routes not found
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'home' }
    }
  ],
})

// Navigation guard to update page title
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - Stratocore Services`
  }
})

export default router
