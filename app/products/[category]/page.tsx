"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { getProducts, getCategories, getCategoryBySlug } from "@/lib/products"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"

// Mock function to get category details
const getCategoryBySlug = (slug: string) => {
  const categories = {
    rings: {
      name: "Rings",
      description: "Discover our exquisite collection of rings, from stunning engagement rings to elegant wedding bands and statement pieces.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop"
    },
    necklaces: {
      name: "Necklaces",
      description: "Browse our selection of necklaces, featuring pendants, chains, and statement pieces crafted with the finest materials.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1587&auto=format&fit=crop"
    },
    bracelets: {
      name: "Bracelets",
      description: "Explore our collection of bracelets, from tennis bracelets to bangles and cuffs, designed to complement any style.",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1588&auto=format&fit=crop"
    },
    watches: {
      name: "Watches",
      description: "Discover our selection of luxury watches, combining precision engineering with elegant design for timeless style.",
      image: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=1587&auto=format&fit=crop"
    }
  }
  
  return categories[slug as keyof typeof categories] || null
}

// Mock function to get products by category
const getProductsByCategory = (category: string) => {
  // In a real app, this would fetch from an API or database
  return [
    {
      id: "diamond-eternity-ring",
      name: "Diamond Eternity Ring",
      price: 3999.99,
      category: "rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
      isNew: true,
      rating: 4.9,
      reviewCount: 42
    },
    {
      id: "sapphire-tennis-bracelet",
      name: "Sapphire Tennis Bracelet",
      price: 2499.99,
      category: "bracelets",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=1588&auto=format&fit=crop",
      isNew: false,
      rating: 4.8,
      reviewCount: 36
    },
    {
      id: "rose-gold-necklace",
      name: "Rose Gold Necklace",
      price: 1899.99,
      category: "necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1587&auto=format&fit=crop",
      isNew: true,
      rating: 4.7,
      reviewCount: 58
    },
    {
      id: "platinum-watch",
      name: "Platinum Watch",
      price: 7999.99,
      category: "watches",
      image: "https://images.unsplash.com/photo-1619946794135-5bc917a27793?q=80&w=1587&auto=format&fit=crop",
      isNew: false,
      rating: 5.0,
      reviewCount: 23
    },
    {
      id: "gold-hoop-earrings",
      name: "Gold Hoop Earrings",
      price: 899.99,
      category: "earrings",
      image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1587&auto=format&fit=crop",
      isNew: false,
      rating: 4.6,
      reviewCount: 31
    },
    {
      id: "pearl-stud-earrings",
      name: "Pearl Stud Earrings",
      price: 599.99,
      category: "earrings",
      image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1587&auto=format&fit=crop",
      isNew: true,
      rating: 4.5,
      reviewCount: 27
    }
  ].filter(product => product.category === category)
}

interface PageProps {
  params: {
    category: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  const { category } = params
  const categoryDetails = getCategoryBySlug(category)
  
  if (!categoryDetails) {
    notFound()
  }
  
  const products = getProductsByCategory(category)
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
  }
  
  return (
    <div className="container px-4 py-10 mx-auto">
      {/* Breadcrumbs */}
      <div className="flex items-center space-x-2 text-sm mb-6">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/products" className="text-muted-foreground hover:text-foreground">
          Products
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium capitalize">{categoryDetails.name}</span>
      </div>
      
      {/* Category Header */}
      <div className="relative h-64 rounded-lg overflow-hidden mb-10">
        <Image
          src={categoryDetails.image}
          alt={categoryDetails.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container px-4 mx-auto">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {categoryDetails.name}
              </h1>
              <p className="text-white/90">
                {categoryDetails.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters and Sorting (placeholder) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <select className="px-3 py-1 border rounded-md bg-background">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>
      
      <Separator className="mb-8" />
      
      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.category}/${product.id}`}
              className="group"
            >
              <div className="space-y-3">
                <div className="relative rounded-lg overflow-hidden bg-muted">
                  <AspectRatio ratio={1/1}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </AspectRatio>
                  {product.isNew && (
                    <Badge className="absolute top-2 right-2 bg-primary hover:bg-primary">
                      New
                    </Badge>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">
                      {formatPrice(product.price)}
                    </p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary mr-1" />
                      <span>{product.rating}</span>
                      <span className="ml-1">({product.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground mb-6">
            We couldn't find any products in this category. Please check back later or browse other categories.
          </p>
          <Button asChild>
            <Link href="/products">
              Browse All Products
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}






