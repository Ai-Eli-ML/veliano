
import { createClient } from "@/lib/supabase/client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_at_price: number | null
  sku: string
  inventory_quantity: number
  is_published: boolean
  featured: boolean
}

interface ProductVariant {
  id: string
  product_id: string
  name: string
  sku: string
  price: number
  inventory_quantity: number
  option1_name: string | null
  option1_value: string | null
  option2_name: string | null
  option2_value: string | null
}

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<Product>({
    id: "",
    name: "",
    description: "",
    price: 0,
    compare_at_price: null,
    sku: "",
    inventory_quantity: 0,
    is_published: false,
    featured: false
  })
  const [variants, setVariants] = useState<ProductVariant[]>([])

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  async function fetchProduct() {
    try {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single()

      if (productError) throw productError

      const { data: variants, error: variantsError } = await supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", params.id)

      if (variantsError) throw variantsError

      setProduct(product)
      setVariants(variants || [])
    } catch (error) {
      console.error("Error fetching product:", error)
      toast.error("Error loading product")
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          description: product.description,
          price: product.price,
          compare_at_price: product.compare_at_price,
          sku: product.sku,
          inventory_quantity: product.inventory_quantity,
          is_published: product.is_published,
          featured: product.featured
        })
        .eq("id", product.id)

      if (error) throw error

      toast.success("Product updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating product:", error)
      toast.error("Error updating product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/products")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) =>
                  setProduct({ ...product, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={product.sku}
                onChange={(e) =>
                  setProduct({ ...product, sku: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={product.price}
                onChange={(e) =>
                  setProduct({ ...product, price: parseFloat(e.target.value) })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compare_at_price">Compare at Price</Label>
              <Input
                id="compare_at_price"
                type="number"
                step="0.01"
                value={product.compare_at_price || ""}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    compare_at_price: e.target.value ? parseFloat(e.target.value) : null
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inventory">Inventory Quantity</Label>
              <Input
                id="inventory"
                type="number"
                value={product.inventory_quantity}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    inventory_quantity: parseInt(e.target.value)
                  })
                }
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status & Visibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_published">Published</Label>
              <Switch
                id="is_published"
                checked={product.is_published}
                onCheckedChange={(checked) =>
                  setProduct({ ...product, is_published: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="featured">Featured</Label>
              <Switch
                id="featured"
                checked={product.featured}
                onCheckedChange={(checked) =>
                  setProduct({ ...product, featured: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">{variant.name}</div>
                    <div className="text-sm text-muted-foreground">
                      SKU: {variant.sku}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      ${variant.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Stock: {variant.inventory_quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
} 
