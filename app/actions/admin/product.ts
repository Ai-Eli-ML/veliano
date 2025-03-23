"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ProductRepository } from "@/lib/repositories/product-repository"
import type { ProductCreateInput, ProductUpdateInput, ProductWithRelations } from "@/types/product"

/**
 * Creates a new product
 */
export async function createProduct(input: ProductCreateInput): Promise<{
  product?: ProductWithRelations
  error?: string
}> {
  try {
    const product = await ProductRepository.createProduct(input)
    revalidatePath("/admin/products")
    return { product }
  } catch (error) {
    console.error("Error creating product:", error)
    return { error: error instanceof Error ? error.message : "Failed to create product" }
  }
}

/**
 * Updates an existing product
 */
export async function updateProduct(
  id: string,
  input: ProductUpdateInput
): Promise<{
  product?: ProductWithRelations
  error?: string
}> {
  try {
    const product = await ProductRepository.updateProduct(id, input)
    revalidatePath("/admin/products")
    revalidatePath(`/products/${product.slug}`)
    return { product }
  } catch (error) {
    console.error("Error updating product:", error)
    return { error: error instanceof Error ? error.message : "Failed to update product" }
  }
}

/**
 * Deletes a product
 */
export async function deleteProduct(id: string): Promise<{
  success?: boolean
  error?: string
}> {
  try {
    await ProductRepository.deleteProduct(id)
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { error: error instanceof Error ? error.message : "Failed to delete product" }
  }
}

/**
 * Updates a product's status
 */
export async function updateProductStatus(
  id: string,
  status: "draft" | "active" | "archived"
): Promise<{
  success?: boolean
  error?: string
}> {
  try {
    await ProductRepository.updateProductStatus(id, status)
    revalidatePath("/admin/products")
    return { success: true }
  } catch (error) {
    console.error("Error updating product status:", error)
    return { error: error instanceof Error ? error.message : "Failed to update product status" }
  }
}

/**
 * Gets product categories
 */
export async function getProductCategories() {
  try {
    const categories = await ProductRepository.getCategories()
    return { categories }
  } catch (error) {
    console.error("Error getting product categories:", error)
    return { error: error instanceof Error ? error.message : "Failed to get product categories" }
  }
} 