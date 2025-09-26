import type { 
  ServiceData, 
  OrderData, 
  PriceRuleData, 
  UserData,
  Category,
  Service,
  PriceRule,
  User,
  Order
} from '@/types'

export class DataService {
  private static instance: DataService
  private servicesData: ServiceData | null = null
  private ordersData: OrderData | null = null
  private priceRulesData: PriceRuleData | null = null
  private usersData: UserData | null = null

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService()
    }
    return DataService.instance
  }

  async loadServices(): Promise<ServiceData> {
    if (!this.servicesData) {
      try {
        const response = await fetch('/data/services.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.servicesData = await response.json()
        
        // Add categoryId to each service for easier lookups
        this.servicesData!.categories.forEach(category => {
          category.services.forEach(service => {
            service.categoryId = category.id
          })
        })
      } catch (error) {
        console.error('Failed to load services:', error)
        throw error
      }
    }
    return this.servicesData!
  }

  async loadOrders(): Promise<OrderData> {
    if (!this.ordersData) {
      try {
        const response = await fetch('/data/orders.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.ordersData = await response.json()
      } catch (error) {
        console.error('Failed to load orders:', error)
        throw error
      }
    }
    return this.ordersData!
  }

  async loadPriceRules(): Promise<PriceRuleData> {
    if (!this.priceRulesData) {
      try {
        const response = await fetch('/data/pricerules.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.priceRulesData = await response.json()
        
        // Set default rule type if not specified - assume percentage
        this.priceRulesData!.rules.forEach(rule => {
          if (!rule.type) {
            rule.type = 'percentage' // Most common type
          }
        })
      } catch (error) {
        console.error('Failed to load price rules:', error)
        throw error
      }
    }
    return this.priceRulesData!
  }

  async loadUsers(): Promise<UserData> {
    if (!this.usersData) {
      try {
        const response = await fetch('/data/user.json')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        this.usersData = await response.json()
      } catch (error) {
        console.error('Failed to load users:', error)
        throw error
      }
    }
    return this.usersData!
  }

  async getAllCategories(): Promise<Category[]> {
    const data = await this.loadServices()
    return data.categories
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const categories = await this.getAllCategories()
    return categories.find(category => category.id === id)
  }

  async getAllServices(): Promise<Service[]> {
    const categories = await this.getAllCategories()
    // Flatten all services from all categories
    return categories.flatMap(category => category.services)
  }

  async getServiceById(id: number): Promise<Service | undefined> {
    const services = await this.getAllServices()
    return services.find(service => service.id === id)
  }

  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    const category = await this.getCategoryById(categoryId)
    return category?.services || []
  }

  async getPriceRules(): Promise<PriceRule[]> {
    const data = await this.loadPriceRules()
    return data.rules
  }

  async getRulesForService(serviceName: string): Promise<PriceRule[]> {
    const rules = await this.getPriceRules()
    return rules.filter(rule => rule.service === serviceName)
  }

  async getRulesForCategory(categoryName: string): Promise<PriceRule[]> {
    const rules = await this.getPriceRules()
    return rules.filter(rule => rule.category === categoryName)
  }

  async getUsers(): Promise<User[]> {
    const data = await this.loadUsers()
    return data.users
  }

  async getUserById(id: number): Promise<User | undefined> {
    const users = await this.getUsers()
    return users.find(user => user.id === id)
  }

  async getOrderHistory(): Promise<Order[]> {
    const data = await this.loadOrders()
    return data.orderHistory
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    const orders = await this.getOrderHistory()
    return orders.filter(order => order.userId === userId)
  }
}

// Export singleton instance for easy use
export const dataService = DataService.getInstance()
