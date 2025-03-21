import type { Database } from './supabase'

type Tables = Database['public']['Tables']

export interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  display_order: number
  position?: number
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  compare_at_price: number | null
  inventory_quantity: number
  option1_name: string | null
  option1_value: string | null
  option2_name: string | null
  option2_value: string | null
  option3_name: string | null
  option3_value: string | null
  created_at: string
  updated_at: string
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  sku: string
  inventory_quantity: number
  is_available: boolean
  is_featured: boolean
  has_variants?: boolean
  is_published?: boolean
  featured?: boolean
  category_id: string | null
  created_at: string
  updated_at: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  categories?: ProductCategory[]
}

export interface ProductFilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured'
  page?: number
  search?: string
  limit?: number
}

export interface ProductsResponse {
  products: Product[]
  total: number
  totalPages: number
}

// Repository types
export type ProductRow = Tables['products']['Row']
export type ProductInsert = Tables['products']['Insert']
export type ProductUpdate = Tables['products']['Update']
export type CategoryRow = Tables['categories']['Row']
export type CategoryInsert = Tables['categories']['Insert']
export type CategoryUpdate = Tables['categories']['Update']

