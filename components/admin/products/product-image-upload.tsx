"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "sonner"
import { Trash2, Upload, ImagePlus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadProductImage, deleteProductImage } from "@/app/actions/admin/product-image"
import { ProductImage } from "@/types/product"
import { cn } from "@/lib/utils"

interface ProductImageUploadProps {
  productId: string
  images: ProductImage[]
  onImageUploaded?: (image: ProductImage) => void
  onImageDeleted?: (imageId: string) => void
}

export function ProductImageUpload({
  productId,
  images = [],
  onImageUploaded,
  onImageDeleted
}: ProductImageUploadProps) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("productId", productId)
      formData.append("file", file)
      formData.append("position", images.length.toString())
      
      const { imageData, error } = await uploadProductImage(formData)
      
      if (error) {
        toast.error("Upload failed", { description: error })
        return
      }
      
      if (imageData) {
        toast.success("Image uploaded successfully")
        onImageUploaded?.(imageData)
        router.refresh()
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }
  
  const handleDelete = async (imageId: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setIsDeleting(imageId)
      
      try {
        const { success, error } = await deleteProductImage(imageId)
        
        if (error) {
          toast.error("Delete failed", { description: error })
          return
        }
        
        if (success) {
          toast.success("Image deleted successfully")
          onImageDeleted?.(imageId)
          router.refresh()
        }
      } catch (error) {
        console.error("Delete error:", error)
        toast.error("Failed to delete image")
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="overflow-hidden group relative">
            <CardContent className="p-2">
              <div className="relative aspect-square overflow-hidden rounded-md">
                <Image
                  src={image.url}
                  alt={image.alt || "Product image"}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDelete(image.id)}
                  disabled={isDeleting === image.id}
                >
                  {isDeleting === image.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Upload Box */}
        <Card className={cn(
          "overflow-hidden flex items-center justify-center border-dashed",
          isUploading ? "opacity-50" : "opacity-100"
        )}>
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              className="hidden"
              id={`product-image-upload-${productId}`}
              disabled={isUploading}
            />
            <label
              htmlFor={`product-image-upload-${productId}`}
              className="w-full h-full flex flex-col items-center justify-center cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
                  <p className="text-sm text-gray-500">Uploading...</p>
                </>
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">Upload Image</p>
                </>
              )}
            </label>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 