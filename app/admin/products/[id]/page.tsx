"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Define product interface
interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inventory: number
  featured: boolean
  specifications: Record<string, string>
  variants: ProductVariant[]
  published: boolean
  createdAt: string
  updatedAt: string
}

interface ProductVariant {
  id: string
  name: string
  price: number
  inventory: number
}

export default function AdminProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  
  useEffect(() => {
    // In a real application, you would fetch the product from your database
    // For now, we'll use a mock product
    setTimeout(() => {
      setProduct({
        id: productId,
        name: "Premium Gold Bracelet",
        description: "Luxurious 18k gold bracelet with diamond accents.",
        price: 1299.99,
        images: [
          "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2187&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1974&auto=format&fit=crop",
        ],
        category: "jewelry",
        inventory: 12,
        featured: true,
        specifications: {
          "Material": "18k Gold",
          "Weight": "15g",
          "Length": "7 inches",
          "Gemstone": "Diamond",
        },
        variants: [
          { id: "var1", name: "Rose Gold", price: 1399.99, inventory: 5 },
          { id: "var2", name: "White Gold", price: 1499.99, inventory: 7 },
        ],
        published: true,
        createdAt: "2024-03-10T12:00:00Z",
        updatedAt: "2024-03-15T14:30:00Z"
      })
      setIsLoading(false)
    }, 1500)
  }, [productId])
  
  const handleSave = async () => {
    if (!product) return
    
    setIsSaving(true)
    
    // Simulate API call to save product
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Product updated", {
      description: "The product has been updated successfully."
    })
    
    setIsSaving(false)
  }
  
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/admin/products")}>
          Back to Products
        </Button>
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex gap-2 mt-1">
            <Badge variant={product.published ? "default" : "outline"}>
              {product.published ? "Published" : "Draft"}
            </Badge>
            {product.featured && (
              <Badge variant="secondary">Featured</Badge>
            )}
            <Badge variant="outline">{product.category}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
              <CardDescription>
                Basic information about the product.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input 
                    id="name" 
                    value={product.name}
                    onChange={(e) => setProduct({...product, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={product.price}
                    onChange={(e) => setProduct({...product, price: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={5}
                  value={product.description}
                  onChange={(e) => setProduct({...product, description: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={product.category}
                    onValueChange={(value) => setProduct({...product, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jewelry">Jewelry</SelectItem>
                      <SelectItem value="watches">Watches</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                      <SelectItem value="gifts">Gifts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input 
                    id="inventory" 
                    type="number" 
                    value={product.inventory}
                    onChange={(e) => setProduct({...product, inventory: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="published" 
                  checked={product.published}
                  onCheckedChange={(checked) => setProduct({...product, published: checked})}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  checked={product.featured}
                  onCheckedChange={(checked) => setProduct({...product, featured: checked})}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>
                Manage product images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.images.map((image, index) => (
                  <div key={index} className="relative border rounded-md overflow-hidden">
                    <AspectRatio ratio={4/3}>
                      <img 
                        src={image} 
                        alt={`Product image ${index + 1}`} 
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="border border-dashed rounded-md flex items-center justify-center min-h-[200px]">
                  <Button variant="outline">Add Image</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="variants" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Variants</CardTitle>
              <CardDescription>
                Manage product variants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {product.variants.map((variant, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Variant Name</Label>
                        <Input value={variant.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Price ($)</Label>
                        <Input type="number" value={variant.price} />
                      </div>
                      <div className="space-y-2">
                        <Label>Inventory</Label>
                        <Input type="number" value={variant.inventory} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="destructive" size="sm">
                        Remove Variant
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline">
                  Add Variant
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
              <CardDescription>
                Technical details and specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Specification</Label>
                      <Input value={key} />
                    </div>
                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input value={value} />
                    </div>
                  </div>
                ))}
                
                <Separator className="my-4" />
                
                <Button variant="outline">
                  Add Specification
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 