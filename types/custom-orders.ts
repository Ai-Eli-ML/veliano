import { Database } from './supabase'

export type OrderStatus = Database['public']['Enums']['order_status']

export type CustomOrder = Database['public']['Tables']['custom_orders']['Row']
export type Customer = Database['public']['Tables']['customers']['Row']
export type AdminUser = Database['public']['Tables']['admin_users']['Row']

export type CustomOrderWithRelations = CustomOrder & {
  customer: Customer
}

export interface CreateCustomOrderData {
  order_number: string
  customer_id: string
  total_price: number
  teeth_selection: Record<string, any>
  material: string
  design_details?: string
  notes?: string
}

export interface UpdateCustomOrderData {
  status?: OrderStatus
  impression_kit_status?: string
  impression_kit_tracking?: string | null
  design_details?: string
  estimated_completion_date?: string
  notes?: string
}

// Repository types
export interface CustomOrderFilters {
  status?: OrderStatus
  customer_id?: string
  from_date?: Date
  to_date?: Date
}

export interface CustomOrderQueryOptions {
  filters?: CustomOrderFilters
  limit?: number
  offset?: number
  order_by?: {
    column: keyof CustomOrder
    direction: 'asc' | 'desc'
  }
} 