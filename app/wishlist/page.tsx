import type { Metadata } from 'next'
import WishlistPage from '@/components/wishlist/WishlistPage'

export const metadata: Metadata = {
  title: 'Wishlist | Veliano Jewelry',
  description: 'View and manage your saved jewelry items in your wishlist'
}

export default function WishlistPageRoute() {
  return <WishlistPage />
} 