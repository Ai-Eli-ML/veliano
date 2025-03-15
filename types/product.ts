export type ProductImage = {
  id: string
  url: string
  alt_text: string | null
  position: number | null
}

export type ProductVariant = {
  id: string
  name: string
  sku: string | null
  price: number | null
  compare_at_price: number | null
  inventory_quantity: number | null
  option1_name: string | null
  option1_value: string | null
  option2_name: string | null
  option2_value: string | null
  option3_name: string | null
  option3_value: string | null
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compare_at_price: number | null
  sku: string | null
  inventory_quantity: number | null
  is_published: boolean | null
  featured: boolean | null
  has_variants: boolean | null
  images: ProductImage[]
  variants: ProductVariant[]
  categories: {
    id: string
    name: string
    slug: string
  }[]
}

export type ProductCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: string | null
  parent?: ProductCategory
  children?: ProductCategory[]
}

export type ProductFilterOptions = {
  category?: string
  minPrice?: number
  maxPrice?: number
  sort?: "price_asc" | "price_desc" | "newest" | "featured"
  page?: number
  limit?: number
  search?: string
}

