import { Database } from './supabase'

type Tables = Database['public']['Tables']

export type ProductStatus = 'draft' | 'active' | 'archived'
export type GrillzMaterial = 'gold_10k' | 'gold_14k' | 'gold_18k' | 'silver_925' | 'platinum'
export type GrillzStyle = 'open_face' | 'closed_face' | 'diamond_cut' | 'custom'
export type TeethPosition = 'top' | 'bottom'

export interface ProductBase {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  featured: boolean
  is_new: boolean
  in_stock: boolean
  stock_quantity: number
  status: ProductStatus
  category_id: string
  metadata: Record<string, any>
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at: string
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  price: number
  sku?: string
  inventory?: number
  isDefault?: boolean
  options?: Record<string, string>
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  productId: string
  position?: number
}

export interface GrillzSpecification {
  id: string
  product_id: string
  material: GrillzMaterial
  style: GrillzStyle
  teeth_position: TeethPosition
  teeth_count: number
  diamond_options?: {
    clarity?: string
    color?: string
    carat?: number
    stone_count?: number
  }
  customization_options: {
    available_materials: GrillzMaterial[]
    available_styles: GrillzStyle[]
    diamond_settings?: string[]
    custom_text_available: boolean
    max_text_length?: number
  }
  base_production_time_days: number
  created_at: string
  updated_at: string
}

export interface ProductWithRelations extends ProductBase {
  variants: ProductVariant[]
  images: ProductImage[]
  grillz_specification?: GrillzSpecification
  category: {
    id: string
    name: string
    slug: string
  }
}

export type ProductCreateInput = Omit<ProductBase, 'id' | 'created_at' | 'updated_at'> & {
  variants?: Omit<ProductVariant, 'id' | 'product_id' | 'created_at' | 'updated_at'>[]
  images?: Omit<ProductImage, 'id' | 'product_id' | 'created_at'>[]
  grillz_specification?: Omit<GrillzSpecification, 'id' | 'product_id' | 'created_at' | 'updated_at'>
}

export type ProductUpdateInput = Partial<Omit<ProductBase, 'id' | 'created_at' | 'updated_at'>>

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

export type Product = Database['public']['Tables']['products']['Row'] & {
  images: {
    id: string;
    url: string;
    alt?: string;
  }[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
};

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

