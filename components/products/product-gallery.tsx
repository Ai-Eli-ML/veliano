"use client"

import { useState } from "react"
import Image from "next/image"
import type { ProductImage } from "@/types/product"
import { cn } from "@/lib/utils"
import { ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  // If no images, show placeholder
  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <Image src="/placeholder.svg?height=800&width=800" alt={productName} fill className="object-cover" />
      </div>
    )
  }

  // Sort images by position
  const sortedImages = [...images].sort((a, b) => (a.position || 0) - (b.position || 0))

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border">
        <div
          className={cn(
            "relative h-full w-full transition-all duration-300",
            isZoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in",
          )}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <Image
            src={sortedImages[selectedImage].url || "/placeholder.svg"}
            alt={sortedImages[selectedImage].alt_text || productName}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              isZoomed ? "object-contain" : "object-cover",
            )}
            priority
          />
        </div>

        {/* Zoom button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute bottom-2 right-2 z-10 bg-white/80 hover:bg-white"
          onClick={(e) => {
            e.stopPropagation()
            setIsZoomed(!isZoomed)
          }}
        >
          {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
        </Button>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {sortedImages.map((image, index) => (
            <button
              key={image.id}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border",
                selectedImage === index && "ring-2 ring-primary",
              )}
              onClick={() => setSelectedImage(index)}
            >
              <Image
                src={image.url || "/placeholder.svg"}
                alt={image.alt_text || `${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

