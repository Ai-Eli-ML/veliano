'use client';

import React, { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Heart, Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { trackRecommendationClick } from '@/lib/analytics'

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
  }
}

export default function ProductRecommendations() {
  const [activeTab, setActiveTab] = useState('based-on-history')
  const [recommendations, setRecommendations] = useState<{
    history: Product[]
    popular: Product[]
    similar: Product[]
  }>({
    history: [],
    popular: [],
    similar: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/products/recommended')
        const data = await response.json()
        
        if (data.success) {
          setRecommendations({
            history: data.data.basedOnHistory || [],
            popular: data.data.popular || [],
            similar: data.data.similar || []
          })
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  const handleProductClick = (productId: string, recommendationType: string) => {
    trackRecommendationClick(productId, recommendationType as any)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading recommendations...</span>
      </div>
    )
  }

  const hasRecommendations = 
    recommendations.history.length > 0 || 
    recommendations.popular.length > 0 || 
    recommendations.similar.length > 0

  if (!hasRecommendations) {
    return (
      <div className="flex h-96 flex-col items-center justify-center text-center">
        <h3 className="text-lg font-medium">No recommendations available yet</h3>
        <p className="mt-2 text-muted-foreground max-w-md">
          Browse more products to get personalized recommendations based on your interests.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="based-on-history" onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="based-on-history">Based on Browsing</TabsTrigger>
          <TabsTrigger value="popular">Popular Items</TabsTrigger>
          <TabsTrigger value="similar-to-cart">Similar to Cart</TabsTrigger>
        </TabsList>
        
        <TabsContent value="based-on-history">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.history.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product.id, 'recently_viewed')} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.popular.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product.id, 'popular')} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="similar-to-cart">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.similar.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product.id, 'similar')} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-3">
        <Link 
          href={`/products/${product.id}`}
          onClick={onClick}
          className="block"
        >
          <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
            {product.images?.[0] && (
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
          
          <div className="mt-3 space-y-1">
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category?.name}</p>
            <p className="font-semibold">{formatCurrency(product.price)}</p>
          </div>
        </Link>
        
        <div className="mt-4 flex items-center justify-between">
          <Button size="sm" className="w-full gap-1">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button variant="ghost" size="icon" className="ml-2">
            <Heart className="h-4 w-4" />
            <span className="sr-only">Add to wishlist</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
