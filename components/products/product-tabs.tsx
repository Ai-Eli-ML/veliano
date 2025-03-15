"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductReviews } from "@/components/products/product-reviews"
import type { Product } from "@/types/product"
import { MessageCircle, Info } from "lucide-react"
import { getProductReviews } from "@/actions/reviews"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductTabsProps {
  product: Product
}

export default function ProductTabs({ product }: ProductTabsProps) {
  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Description
        </TabsTrigger>
        <TabsTrigger value="specifications" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Specifications
        </TabsTrigger>
        <TabsTrigger value="reviews" className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Reviews
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="prose max-w-none dark:prose-invert">
          {product.description ? (
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          ) : (
            <p>No description available for this product.</p>
          )}
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <tbody className="divide-y">
              <tr className="divide-x">
                <th className="bg-muted/50 px-4 py-2 text-left font-medium">Material</th>
                <td className="px-4 py-2">
                  {product.name.toLowerCase().includes("10k")
                    ? "10K Gold"
                    : product.name.toLowerCase().includes("14k")
                      ? "14K Gold"
                      : product.name.toLowerCase().includes("18k")
                        ? "18K Gold"
                        : "Gold"}
                </td>
              </tr>
              <tr className="divide-x">
                <th className="bg-muted/50 px-4 py-2 text-left font-medium">Weight</th>
                <td className="px-4 py-2">Varies by size</td>
              </tr>
              <tr className="divide-x">
                <th className="bg-muted/50 px-4 py-2 text-left font-medium">Custom Fitted</th>
                <td className="px-4 py-2">Yes</td>
              </tr>
              <tr className="divide-x">
                <th className="bg-muted/50 px-4 py-2 text-left font-medium">Warranty</th>
                <td className="px-4 py-2">30-day manufacturer warranty</td>
              </tr>
              <tr className="divide-x">
                <th className="bg-muted/50 px-4 py-2 text-left font-medium">SKU</th>
                <td className="px-4 py-2">{product.sku || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <ProductReviewsWrapper productId={product.id} />
        </Suspense>
      </TabsContent>
    </Tabs>
  )
}

async function ProductReviewsWrapper({ productId }: { productId: string }) {
  const result = await getProductReviews(productId)

  if (!result.success || !result.data) {
    return <div className="text-red-500">{result.error || "Failed to load reviews"}</div>
  }

  const reviews = result.data.map((review) => ({
    id: review.id,
    productId: review.product_id,
    userId: review.user_id,
    userName: review.user.full_name,
    rating: review.rating,
    title: review.title,
    content: review.content,
    createdAt: review.created_at,
    updatedAt: review.created_at,
    isVerifiedPurchase: review.verified_purchase,
    helpfulCount: review.helpful_count,
    ...(review.user.avatar_url ? { userAvatar: review.user.avatar_url } : {}),
  }))

  return <ProductReviews productId={productId} reviews={reviews} stats={result.stats} />
}

