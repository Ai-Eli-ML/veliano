"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Minus, Plus, Heart, Share2, ShoppingCart, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface Product {
  id: string
  name: string
  slug: string
  category: string
  price: number
  originalPrice?: number
  description: string
  features: string[]
  specifications: Record<string, string>
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  isNew: boolean
  relatedProducts: {
    id: string
    name: string
    price: number
    category: string
    image: string
    rating: number
    reviewCount: number
  }[]
}

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1)
    }
  }
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    })
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Images */}
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden bg-muted">
          <AspectRatio ratio={1/1}>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-primary hover:bg-primary">
                New
              </Badge>
            )}
          </AspectRatio>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {product.images.map((image, index) => (
            <button
              key={index}
              className={`relative rounded-md overflow-hidden border-2 ${
                selectedImage === index ? "border-primary" : "border-transparent"
              }`}
              onClick={() => setSelectedImage(index)}
            >
              <AspectRatio ratio={1/1}>
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </AspectRatio>
            </button>
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-primary text-primary"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            <Separator orientation="vertical" className="h-5" />
            <span className="text-sm text-muted-foreground">
              {product.stock > 0 ? (
                <span className="flex items-center text-green-600">
                  <Check className="h-4 w-4 mr-1" />
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Save {formatPrice(product.originalPrice - product.price)}
            </Badge>
          )}
        </div>
        
        <Separator />
        
        <div>
          <p className="text-muted-foreground">{product.description}</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-24 font-medium">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button className="flex-1" size="lg">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            Buy Now
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" className="h-12 w-12">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
        
        <Separator />
        
        <div className="space-y-2">
          <h3 className="font-medium">Features:</h3>
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-green-600 mr-2 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
} 