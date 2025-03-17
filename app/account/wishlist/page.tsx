"use client"

import { useState, useEffect } from "react"
import { PageHeading } from "@/components/ui/page-heading"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { ShoppingCart, Trash2, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"

// Interface for wishlist items that matches Supabase structure
interface WishlistItem {
  id: string
  product_id: string
  name: string
  price: number
  image: string
  category: string
  created_at: string
  in_stock: boolean
}

export default function WishlistPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  
  useEffect(() => {
    // In a real implementation, this would fetch from Supabase
    // const fetchWishlist = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   const { data: { session } } = await supabase.auth.getSession()
    //   
    //   if (!session) {
    //     return null
    //   }
    //   
    //   const { data, error } = await supabase
    //     .from("wishlist")
    //     .select("*, products(*)")
    //     .eq("user_id", session.user.id)
    //   
    //   if (error) throw error
    //   
    //   // Transform data to match our interface
    //   return data.map(item => ({
    //     id: item.id,
    //     product_id: item.product_id,
    //     name: item.products.name,
    //     price: item.products.price,
    //     image: item.products.images[0],
    //     category: item.products.category,
    //     created_at: item.created_at,
    //     in_stock: item.products.stock > 0
    //   }))
    // }
    
    // Simulate API call
    const fetchWishlist = async () => {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Check if user is authenticated (mock)
      const isAuthenticated = true
      if (!isAuthenticated) {
        return null
      }
      
      // Mock wishlist data
      return [
        {
          id: "wish1",
          product_id: "prod1",
          name: "Vintage Gold Bracelet",
          price: 7500,
          image: "/images/products/bracelet.jpg",
          category: "Jewelry",
          created_at: "2025-03-01T10:30:00Z",
          in_stock: true
        },
        {
          id: "wish2",
          product_id: "prod2",
          name: "Silver Pendant Necklace",
          price: 4000,
          image: "/images/products/necklace.jpg",
          category: "Jewelry",
          created_at: "2025-02-25T14:15:00Z",
          in_stock: true
        },
        {
          id: "wish3",
          product_id: "prod3",
          name: "Diamond Stud Earrings",
          price: 12000,
          image: "/images/products/earrings.jpg",
          category: "Jewelry",
          created_at: "2025-02-20T09:45:00Z",
          in_stock: false
        }
      ] as WishlistItem[]
    }
    
    fetchWishlist()
      .then(data => {
        if (data === null) {
          redirect("/account/login?redirect=/account/wishlist")
        }
        setWishlistItems(data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error("Error fetching wishlist:", error)
        setIsLoading(false)
      })
  }, [])
  
  const removeFromWishlist = (id: string) => {
    // In a real implementation, this would call Supabase
    // const removeItem = async () => {
    //   const supabase = await createServerSupabaseClient()
    //   const { error } = await supabase
    //     .from("wishlist")
    //     .delete()
    //     .eq("id", id)
    //   
    //   if (error) throw error
    // }
    
    // For now, just update the UI
    setWishlistItems(prev => prev.filter(item => item.id !== id))
  }
  
  const addToCart = (item: WishlistItem) => {
    // In a real implementation, this would add to cart and potentially remove from wishlist
    console.log("Adding to cart:", item)
    // For demo purposes, we'll just remove from wishlist
    removeFromWishlist(item.id)
  }
  
  if (isLoading) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="My Wishlist" description="Items you've saved for later" />
        <div className="mt-8 flex items-center justify-center">
          <div className="animate-pulse">Loading your wishlist...</div>
        </div>
      </div>
    )
  }
  
  if (wishlistItems.length === 0) {
    return (
      <div className="container max-w-screen-xl py-8">
        <PageHeading title="My Wishlist" description="Items you've saved for later" />
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Heart className="h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">Save items you like while browsing our products.</p>
          <Button className="mt-4" asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container max-w-screen-xl py-8">
      <PageHeading title="My Wishlist" description="Items you've saved for later" />
      
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative aspect-square">
              {item.image && (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              )}
              {!item.in_stock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="rounded-md bg-white px-2 py-1 text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>
            
            <CardHeader>
              <CardTitle className="line-clamp-1">{item.name}</CardTitle>
              <CardDescription>{item.category}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">{formatPrice(item.price)}</p>
                {item.in_stock ? (
                  <span className="text-sm text-green-600">In Stock</span>
                ) : (
                  <span className="text-sm text-red-600">Out of Stock</span>
                )}
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
              
              <Button 
                size="sm" 
                className="flex-1"
                disabled={!item.in_stock}
                onClick={() => addToCart(item)}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}






// Fixed: Removed 1 unused imports
