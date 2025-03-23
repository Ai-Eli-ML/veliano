import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getProductCategories } from "@/app/actions/admin/product"
import { ProductForm } from "@/components/admin/products/product-form"

export const metadata: Metadata = {
  title: "New Product - Veliano Admin",
  description: "Create a new product",
}

export default async function NewProductPage() {
  const { categories, error } = await getProductCategories()
  
  if (error) {
    console.error("Error loading categories:", error)
    // We'll still render the page but without categories
  }
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">New Product</h1>
        <p className="text-gray-500">Create a new product for your store</p>
      </div>
      
      <ProductForm categories={categories || []} />
    </div>
  )
} 