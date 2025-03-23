import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/products/product-form"
import { ProductRepository } from "@/lib/repositories/product-repository"
import { getProductCategories } from "@/app/actions/admin/product"
import { ProductImageUpload } from "@/components/admin/products/product-image-upload"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Edit Product - Veliano Admin",
  description: "Edit an existing product",
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const productId = params.id
  
  // Fetch the product data
  let product
  try {
    product = await ProductRepository.getProductById(productId)
    if (!product) {
      return notFound()
    }
  } catch (error) {
    console.error("Error fetching product:", error)
    return notFound()
  }
  
  // Fetch categories for the form
  const { categories, error: categoriesError } = await getProductCategories()
  
  if (categoriesError) {
    console.error("Error loading categories:", categoriesError)
    // We'll still render the page but without categories
  }
  
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-500">Update product information</p>
      </div>
      
      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Product Details</TabsTrigger>
          <TabsTrigger value="images">Product Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="pt-4">
          <ProductForm 
            product={product} 
            categories={categories || []} 
          />
        </TabsContent>
        
        <TabsContent value="images" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductImageUpload
                productId={productId}
                images={product.images || []}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 