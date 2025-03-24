import { Product } from '@/types/product'

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface WishlistResponse {
  success: boolean
  data?: WishlistItem[]
  error?: string
}

export interface WishlistActionResponse {
  success: boolean
  message?: string
  error?: string
}

export interface WishlistStatusResponse {
  success: boolean
  isInWishlist: boolean
  error?: string
}

export type WishlistToggleResponse = WishlistActionResponse

export interface WishlistButtonProps {
  productId: string
  variant?: 'default' | 'outline' | 'ghost' | 'destructive'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showText?: boolean
  className?: string
}
