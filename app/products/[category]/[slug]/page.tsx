import Image from "next/image"
import Link from "next/link"
import { Star, Package, Heart } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProductRepository } from "@/lib/repositories/product-repository"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { formatCurrency } from "@/lib/utils"
import type { ProductWithRelations } from "@/types/product"
import { ProductRating } from "@/components/products/product-rating"

interface ProductPageProps {
  params: { 
    category: string
    slug: string 
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  try {
    const product = await ProductRepository.getProductBySlug(params.slug)
    
    return {
      title: product?.seo_title || product?.name || "Product",
      description: product?.seo_description || product?.description || "Product details"
    }
  } catch (error) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found"
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = params
  
  // Fetch product from database
  let product: ProductWithRelations
  try {
    const productData = await ProductRepository.getProductBySlug(slug)
    
    if (!productData) {
      notFound()
    }
    
    product = productData
  } catch (error) {
    console.error("Error fetching product:", error)
    notFound()
  }
  
  // Get stock status
  const stockStatus = product.in_stock ? "In Stock" : "Out of Stock"
  
  // Default rating values (in a real app, these would come from a reviews system)
  const rating = product.metadata?.rating || 4.5
  const reviewCount = product.metadata?.review_count || 0
  
  // Sort images by position if needed
  const sortedImages = product.images && product.images.length > 0
    ? [...product.images].sort((a, b) => (a.position || 0) - (b.position || 0))
    : [];
    
  const hasMultipleImages = sortedImages.length > 1;
  
  return (
    <div className="container px-4 py-10 mx-auto">
      <div className="flex items-center space-x-2 text-sm mb-6">
        <Link href="/" className="text-muted-foreground hover:text-foreground">
          Home
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href="/products" className="text-muted-foreground hover:text-foreground">
          Products
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link 
          href={`/products/${category}`} 
          className="text-muted-foreground hover:text-foreground capitalize"
        >
          {category}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-foreground font-medium">{product.name}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {sortedImages.length > 0 ? (
            <>
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <AspectRatio ratio={1/1}>
                  <Image
                    src={sortedImages[0].url}
                    alt={sortedImages[0].alt || product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </AspectRatio>
              </div>
              
              {/* Thumbnail gallery */}
              {hasMultipleImages && (
                <div className="grid grid-cols-5 gap-2">
                  {sortedImages.map((image, i) => (
                    <div key={image.id} className="relative rounded-md overflow-hidden bg-muted">
                      <AspectRatio ratio={1/1}>
                        <Image
                          src={image.url}
                          alt={image.alt || `${product.name} - Image ${i + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                      </AspectRatio>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
              <AspectRatio ratio={1/1}>
                <div className="flex flex-col items-center justify-center h-full">
                  <Package className="h-16 w-16 text-muted-foreground" />
                  <p className="text-muted-foreground mt-2">No image available</p>
                </div>
              </AspectRatio>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-4">
            <ProductRating rating={rating} count={reviewCount} />
            <Badge variant="outline" className="px-2 font-normal">
              {stockStatus}
            </Badge>
          </div>
          
          <div className="flex items-baseline gap-4">
            <h2 className="text-3xl font-bold">{formatCurrency(product.price)}</h2>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <h2 className="text-xl text-muted-foreground line-through">
                {formatCurrency(product.compare_at_price)}
              </h2>
            )}
          </div>
          
          <Separator />
          
          <div className="prose prose-sm max-w-none">
            <p>{product.description}</p>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row">
            <AddToCartButton 
              productId={product.id}
              name={product.name}
              price={product.price}
              image={sortedImages.length > 0 ? sortedImages[0].url : "/images/product-placeholder.png"}
            />
            <Button variant="outline" size="icon" className="sm:w-12">
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
          
          {/* Product metadata */}
          {product.grillz_specification && (
            <div className="border-t pt-4 mt-6">
              <h3 className="font-medium text-lg mb-2">Specifications</h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Material</dt>
                  <dd className="mt-1 text-sm">{product.grillz_specification.material}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Style</dt>
                  <dd className="mt-1 text-sm">{product.grillz_specification.style}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Teeth Position</dt>
                  <dd className="mt-1 text-sm">{product.grillz_specification.teeth_position}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Production Time</dt>
                  <dd className="mt-1 text-sm">{product.grillz_specification.base_production_time_days} days</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
