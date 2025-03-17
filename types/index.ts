import { Database } from "./supabase"

// Supabase table types
export type Affiliate = Database["public"]["Tables"]["affiliates"]["Row"]
export type Ambassador = Database["public"]["Tables"]["ambassadors"]["Row"]
export type Order = Database["public"]["Tables"]["orders"]["Row"]
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"]
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductVariant = Database["public"]["Tables"]["product_variants"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
export type Referral = Database["public"]["Tables"]["referrals"]["Row"]
export type ErrorLog = Database["public"]["Tables"]["error_logs"]["Row"]

// Extended types with relationships
export interface AffiliateWithRelations extends Affiliate {
  profiles: Profile
  referrals: Referral[]
}

export interface OrderWithRelations extends Order {
  profiles: Profile
  order_items: (OrderItem & {
    products: Product
    product_variants?: ProductVariant
  })[]
}

export interface ProductWithVariants extends Product {
  product_variants: ProductVariant[]
}

export interface ProfileWithOrders extends Profile {
  orders: Order[]
}

// Ambassador types
export interface AmbassadorSettings {
  displayName: string
  email: string
  website: string | null
  payoutMethod: "paypal" | "bank_transfer"
  payoutEmail: string
  minimumPayout: number
  emailNotifications: boolean
}

export interface Payout {
  id: string
  amount: number
  status: "pending" | "paid" | "failed"
  created_at: string
  paid_at: string | null
  method: string
}

// Dashboard stats
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  totalProducts: number
  recentOrders: OrderWithRelations[]
}

export interface ProductOption {
  name: string
  value: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  options?: ProductOption[]
}

export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  stock?: number
  sku?: string
  options?: {
    name: string
    values: string[]
  }[]
  rating?: number
  reviews?: number
  isNew?: boolean
  isFeatured?: boolean
  createdAt?: string
  updatedAt?: string
} 