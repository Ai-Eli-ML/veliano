
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductBySlug } from "@/lib/products"
import ProductGallery from "@/components/products/product-gallery"
import ProductInfo from "@/components/products/product-info"
import ProductTabs from "@/components/products/product-tabs"
import RelatedProducts from "@/components/products/related-products"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductPageProps {
  params: {
    category: string
    slug: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found",
    }
  }

  return {
    title: product.name,
    description: product.description || `${product.name} - Custom Gold Grillz`,
    openGraph: {
      images: product.images.length > 0 ? [product.images[0].url] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Check if product belongs to the specified category
  const categoryMatch = product.categories.some((cat) => cat.slug === params.category)

  if (!categoryMatch) {
    notFound()
  }

  // Get the primary category for related products
  const primaryCategory = product.categories[0]

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Product Gallery */}
        <Suspense fallback={<Skeleton className="aspect-square h-full w-full" />}>
          <ProductGallery images={product.images} productName={product.name} />
        </Suspense>

        {/* Product Info */}
        <ProductInfo product={product} />
      </div>

      {/* Product Tabs (Description, Specifications, Reviews) */}
      <div className="mt-12">
        <ProductTabs product={product} />
      </div>

      {/* Related Products */}
      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <RelatedProducts productId={product.id} categoryId={primaryCategory.id} />
        </Suspense>
      </div>
    </div>
  )
}

