"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import type { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Heart, Share2, Check, Truck, ShieldCheck, Minus, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductInfoProps {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, isItemInCart } = useCart()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isItemInWishlist } = useWishlist()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product.has_variants && product.variants.length > 0 ? product.variants[0].id : null,
  )

  // Get the selected variant
  const variant = selectedVariant ? product.variants.find((v) => v.id === selectedVariant) : null

  // Determine the price to display
  const displayPrice = variant?.price || product.price
  const displayComparePrice = variant?.compare_at_price || product.compare_at_price

  // Calculate discount percentage
  const discountPercentage = displayComparePrice
    ? Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)
    : 0

  // Check if product is in stock
  const inStock = variant
    ? variant.inventory_quantity === null || variant.inventory_quantity > 0
    : product.inventory_quantity === null || product.inventory_quantity > 0

  // Check if product is in wishlist
  const isInWishlist = isItemInWishlist(product.id)

  // Handle add to cart
  const handleAddToCart = () => {
    if (!inStock) return

    const item = {
      productId: product.id,
      variantId: selectedVariant || undefined,
      name: product.name,
      price: displayPrice,
      quantity,
      image: product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
      options: variant
        ? {
            [variant.option1_name || "Option"]: variant.option1_value || "",
            ...(variant.option2_name && variant.option2_value
              ? { [variant.option2_name]: variant.option2_value }
              : {}),
            ...(variant.option3_name && variant.option3_value
              ? { [variant.option3_name]: variant.option3_value }
              : {}),
          }
        : undefined,
    }

    addItem(item)

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      })
    } else {
      // Get the primary category for the product URL
      const primaryCategory = product.categories.length > 0 ? product.categories[0] : null

      addToWishlist({
        id: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        price: displayPrice,
        image: product.images.length > 0 ? product.images[0].url : "/placeholder.svg",
        slug: product.slug,
        category: primaryCategory?.slug || "uncategorized",
      })

      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      })
    }
  }

  // Group variants by option1
  const variantOptions =
    product.has_variants && product.variants.length > 0
      ? Array.from(new Set(product.variants.map((v) => v.option1_value)))
      : []

  // Increment/decrement quantity
  const incrementQuantity = () => setQuantity((prev) => Math.min(prev + 1, 10))
  const decrementQuantity = () => setQuantity((prev) => Math.max(prev - 1, 1))

  return (
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>

        {/* Price */}
        <div className="mt-2 flex items-center space-x-2">
          <span className="text-2xl font-bold">{formatCurrency(displayPrice)}</span>

          {displayComparePrice && displayComparePrice > displayPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">{formatCurrency(displayComparePrice)}</span>
              <Badge variant="destructive" className="ml-2">
                {discountPercentage}% OFF
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className="flex items-center">
        {inStock ? (
          <Badge
            variant="outline"
            className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
          >
            <Check className="h-3.5 w-3.5" />
            In Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            Out of Stock
          </Badge>
        )}
      </div>

      {/* Short Description */}
      {product.description && (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p>{product.description.substring(0, 150)}...</p>
        </div>
      )}

      <Separator />

      {/* Variants */}
      {product.has_variants && variantOptions.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">{product.variants[0].option1_name || "Option"}</label>
            <div className="flex flex-wrap gap-2">
              {variantOptions.map((option) => {
                const variantForOption = product.variants.find((v) => v.option1_value === option)
                const isSelected = variant?.option1_value === option
                const isAvailable =
                  variantForOption?.inventory_quantity === null || variantForOption?.inventory_quantity! > 0

                return (
                  <button
                    key={option}
                    className={cn(
                      "rounded-md border px-3 py-1 text-sm",
                      isSelected ? "border-primary bg-primary/10" : "border-input hover:bg-accent",
                      !isAvailable && "cursor-not-allowed opacity-50",
                    )}
                    disabled={!isAvailable}
                    onClick={() => {
                      const newVariant = product.variants.find((v) => v.option1_value === option)
                      if (newVariant) {
                        setSelectedVariant(newVariant.id)
                      }
                    }}
                  >
                    {option}
                    {!isAvailable && " (Out of Stock)"}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Additional options (option2, option3) would go here */}
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <label htmlFor="quantity" className="block text-sm font-medium">
          Quantity
        </label>
        <div className="flex items-center">
          <Button variant="outline" size="icon" onClick={decrementQuantity} disabled={quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <div className="w-12 text-center">{quantity}</div>
          <Button variant="outline" size="icon" onClick={incrementQuantity} disabled={quantity >= 10}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <Button size="lg" className="flex-1 metallic-button" disabled={!inStock} onClick={handleAddToCart}>
          <ShoppingCart className="mr-2 h-5 w-5" />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </Button>

        <Button
          size="lg"
          variant={isInWishlist ? "default" : "outline"}
          className={isInWishlist ? "bg-red-500 hover:bg-red-600" : ""}
          onClick={handleWishlistToggle}
        >
          <Heart className={cn("mr-2 h-5 w-5", isInWishlist && "fill-current")} />
          {isInWishlist ? "In Wishlist" : "Wishlist"}
        </Button>

        <Button size="lg" variant="outline" className="sm:w-auto">
          <Share2 className="h-5 w-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>

      {/* Product Benefits */}
      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">Free shipping on orders over $100</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm">30-day money-back guarantee</span>
        </div>
      </div>

      {/* SKU */}
      {(product.sku || variant?.sku) && (
        <div className="text-sm text-muted-foreground">SKU: {variant?.sku || product.sku}</div>
      )}

      {/* Categories */}
      {product.categories.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Categories: {product.categories.map((cat) => cat.name).join(", ")}
        </div>
      )}
    </div>
  )
}

