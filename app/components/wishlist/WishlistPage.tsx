'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Loader2, Trash2, ShoppingCart, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

// Import server actions directly
import { getWishlistItems, removeFromWishlist, clearWishlist } from '@/app/actions/wishlist'

interface WishlistItem {
  id: string
  product: {
    id: string
    name: string
    slug: string
    price: number
    compare_at_price: number | null
    images: string[]
    description: string
    category_id: string
  }
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({})
  const [isClearing, setIsClearing] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const fetchWishlistItems = async () => {
  if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const result = await getWishlistItems()
      if (result.success) {
        setWishlistItems(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching wishlist items:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchWishlistItems()
  }, [user])

  const handleRemoveItem = async (productId: string) => {
    setIsRemoving(prev => ({ ...prev, [productId]: true }))
    try {
      const result = await removeFromWishlist(productId)
      if (result.success) {
        setWishlistItems(prev => prev.filter(item => item.product.id !== productId))
      }
    } catch (error) {
      console.error('Error removing wishlist item:', error)
    } finally {
      setIsRemoving(prev => ({ ...prev, [productId]: false }))
    }
  }

  const handleClearWishlist = async () => {
    if (confirm('Are you sure you want to clear your wishlist?')) {
      setIsClearing(true)
      try {
        const result = await clearWishlist()
        if (result.success) {
          setWishlistItems([])
        }
      } catch (error) {
        console.error('Error clearing wishlist:', error)
      } finally {
        setIsClearing(false)
      }
    }
  }

  const handleSignIn = () => {
    router.push('/auth/signin')
  }

  if (!user) {
    return (
      <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Sign in to view your wishlist</h2>
            <p className="mt-2 text-muted-foreground">
              Please sign in or create an account to save items to your wishlist.
            </p>
            <Button onClick={handleSignIn} className="mt-4">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading your wishlist...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Wishlist</h1>
            <p className="mt-2 text-muted-foreground">
              Keep track of items you love and want to purchase later.
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button 
              variant="outline" 
              className="flex items-center space-x-2" 
              onClick={handleClearWishlist}
              disabled={isClearing}
            >
              {isClearing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              <span>Clear All</span>
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
            <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-bold">Your wishlist is empty</h2>
            <p className="mt-2 text-muted-foreground">
              Explore our catalog and save items you love for later.
            </p>
            <Link href="/products">
              <Button className="mt-4">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <Link href={`/products/${item.product.slug}`}>
                  <div className="aspect-square overflow-hidden">
                    {item.product.images && item.product.images.length > 0 ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        width={300}
                        height={300}
                        className="h-full w-full object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-secondary">
                        <span className="text-sm text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-medium">{item.product.name}</h3>
                  </Link>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="font-bold">
                      {formatCurrency(item.product.price)}
                    </span>
                    {item.product.compare_at_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(item.product.compare_at_price)}
                      </span>
      )}
    </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {item.product.description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t p-4">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product.id)}
                    disabled={isRemoving[item.product.id]}
                    className="flex items-center space-x-1"
                  >
                    {isRemoving[item.product.id] ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    <span>Remove</span>
                  </Button>
                  <Link href={`/products/${item.product.slug}`}>
                    <Button className="flex items-center space-x-1">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      <span>View</span>
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        </div>
    </div>
  )
}
