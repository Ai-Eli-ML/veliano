"use server"

import { revalidatePath } from "next/cache"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { v4 as uuidv4 } from "uuid"
import type { Database } from "@/types/supabase"
import type { ProductImage } from "@/types/product"

// Max file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

/**
 * Uploads a product image to Supabase storage and creates a database entry
 */
export async function uploadProductImage(
  formData: FormData
): Promise<{ imageData?: ProductImage; error?: string }> {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    
    // Validate authentication
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return { error: "Unauthorized" }
    }
    
    // Get the product ID and file from the form data
    const productId = formData.get("productId") as string
    const file = formData.get("file") as File
    const alt = formData.get("alt") as string || ""
    const position = parseInt(formData.get("position") as string || "0")
    
    if (!productId) {
      return { error: "Product ID is required" }
    }
    
    if (!file || !(file instanceof File)) {
      return { error: "Image file is required" }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return { error: "File size exceeds 5MB limit" }
    }

    // Validate file type
    const fileExt = file.name.split(".").pop()?.toLowerCase() || ""
    if (!["jpg", "jpeg", "png", "webp"].includes(fileExt)) {
      return { error: "Invalid file type. Only JPG, PNG and WebP images are allowed" }
    }

    // Create a unique filename
    const fileName = `${productId}/${uuidv4()}.${fileExt}`
    
    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      })
    
    if (uploadError) {
      console.error("Image upload error:", uploadError)
      return { error: `Failed to upload image: ${uploadError.message}` }
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName)
    
    // Create a database entry for the image
    const { data: imageData, error: dbError } = await supabase
      .from("product_images")
      .insert({
        product_id: productId,
        url: publicUrl,
        alt: alt || file.name,
        position
      })
      .select()
      .single()
    
    if (dbError) {
      console.error("Database error:", dbError)
      // Clean up the uploaded file if the database entry fails
      await supabase.storage.from("product-images").remove([fileName])
      return { error: `Failed to save image information: ${dbError.message}` }
    }
    
    // Revalidate paths
    revalidatePath(`/admin/products/${productId}`)
    revalidatePath(`/admin/products`)
    revalidatePath(`/products/${productId}`)
    
    return { imageData: imageData as unknown as ProductImage }
    
  } catch (error) {
    console.error("Error uploading product image:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

/**
 * Updates product image information (alt text, position)
 */
export async function updateProductImage(
  imageId: string,
  updates: { alt?: string; position?: number }
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    
    // Get the product ID for revalidation
    const { data: image, error: fetchError } = await supabase
      .from("product_images")
      .select("product_id")
      .eq("id", imageId)
      .single()
    
    if (fetchError) {
      return { error: `Failed to fetch image data: ${fetchError.message}` }
    }
    
    // Update the image data
    const { error: updateError } = await supabase
      .from("product_images")
      .update({
        alt: updates.alt,
        position: updates.position,
        updated_at: new Date().toISOString()
      })
      .eq("id", imageId)
    
    if (updateError) {
      return { error: `Failed to update image: ${updateError.message}` }
    }
    
    // Revalidate paths
    revalidatePath(`/admin/products/${image.product_id}`)
    revalidatePath(`/products/${image.product_id}`)
    
    return { success: true }
    
  } catch (error) {
    console.error("Error updating product image:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
}

/**
 * Deletes a product image
 */
export async function deleteProductImage(
  imageId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    
    // Get the image data
    const { data: image, error: fetchError } = await supabase
      .from("product_images")
      .select("*")
      .eq("id", imageId)
      .single()
    
    if (fetchError) {
      return { error: `Failed to fetch image data: ${fetchError.message}` }
    }
    
    // Get the storage file path from the URL
    const urlParts = image.url.split('/product-images/')
    if (urlParts.length !== 2) {
      return { error: "Invalid image URL format" }
    }
    
    const filePath = urlParts[1]
    
    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([filePath])
    
    if (storageError) {
      console.error("Storage error:", storageError)
      // Continue to delete the database entry even if storage deletion fails
    }
    
    // Delete the database entry
    const { error: dbError } = await supabase
      .from("product_images")
      .delete()
      .eq("id", imageId)
    
    if (dbError) {
      return { error: `Failed to delete image record: ${dbError.message}` }
    }
    
    // Revalidate paths
    revalidatePath(`/admin/products/${image.product_id}`)
    revalidatePath(`/admin/products`)
    revalidatePath(`/products/${image.product_id}`)
    
    return { success: true }
    
  } catch (error) {
    console.error("Error deleting product image:", error)
    return { error: error instanceof Error ? error.message : "An unexpected error occurred" }
  }
} 