'use client';

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Loader2, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { formatCurrency } from '@/lib/utils'
import { trackRecommendationClick } from '@/lib/analytics'

interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: {
    id: string
    name: string
  }
}

interface SearchResultsProps {
  results: Product[]
  isLoading: boolean
  totalResults: number
  currentPage: number
  onPageChange: (page: number) => void
}

export default function SearchResults({
  results,
  isLoading,
  totalResults,
  currentPage,
  onPageChange
}: SearchResultsProps) {
  const ITEMS_PER_PAGE = 12
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  
  // Handle clicking on a product
  const handleProductClick = (productId: string) => {
    trackRecommendationClick(productId, 'search')
  }
  
  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading results...</span>
      </div>
    )
  }
  
  // No results state
  if (results.length === 0) {
    return (
      <div className="flex h-[300px] w-full flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-muted p-3">
          <Search className="h-6 w-6 text-muted-foreground" />
      </div>
        <h3 className="text-lg font-medium">No products found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filter criteria
        </p>
      </div>
    )
  }
  
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{results.length}</span> of{' '}
          <span className="font-medium">{totalResults}</span> products
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((product) => (
          <div 
            key={product.id} 
            className="group relative overflow-hidden rounded-md border bg-background p-2"
          >
            <Link 
              href={`/products/${product.id}`}
              onClick={() => handleProductClick(product.id)}
              className="block overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                {product.images?.[0] && (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                )}
              </div>
              
              <div className="mt-3 space-y-1 text-sm">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-muted-foreground">{product.category?.name}</p>
                <p className="font-semibold">{formatCurrency(product.price)}</p>
              </div>
            </Link>
            
            <div className="absolute right-2 top-2 flex flex-col space-y-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Heart className="h-4 w-4" />
                <span className="sr-only">Add to wishlist</span>
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <ShoppingCart className="h-4 w-4" />
                <span className="sr-only">Add to cart</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className="h-8 w-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
