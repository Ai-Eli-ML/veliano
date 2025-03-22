import { Database } from './supabase'

export type OrderStatus = 
  | 'pending'
  | 'impression_kit_sent'
  | 'impression_received'
  | 'in_design'
  | 'in_production'
  | 'completed'

export type CustomOrder = Database['public']['Tables']['custom_orders']['Row']

export interface CustomOrderWithRelations extends CustomOrder {
  product: Database['public']['Tables']['products']['Row']
  order: Database['public']['Tables']['orders']['Row']
}

export interface CreateCustomOrderData {
  product_id: string
  customer_notes?: string
} 