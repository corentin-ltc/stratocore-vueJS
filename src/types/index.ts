// Types pour le système de gestion des commandes de services

export interface Service {
  id: number
  name: string
  description: string
  price: number
  categoryId?: number
}

export interface Category {
  id: number
  name: string
  services: Service[]
}

export interface User {
  id: number
  username: string
  email: string
}

export interface OrderService {
  serviceId: number
  quantity: number
}

export interface Order {
  orderId: string
  userId: number
  date: string
  services: OrderService[]
  totalAmount?: number
}

export interface PriceRule {
  category?: string
  service?: string
  discount: number
  type?: 'percentage' | 'fixed' | 'bogo' // Buy One Get One
  minQuantity?: number
}

export interface CartItem {
  service: Service
  quantity: number
  originalPrice: number
  discountedPrice?: number
  appliedRules?: PriceRule[]
}

export interface Cart {
  items: CartItem[]
  totalOriginalPrice: number
  totalDiscountedPrice: number
  totalSavings: number
}

export interface ServiceData {
  categories: Category[]
}

export interface OrderData {
  orderHistory: Order[]
}

export interface PriceRuleData {
  rules: PriceRule[]
}

export interface UserData {
  users: User[]
}
