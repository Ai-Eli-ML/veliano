import { getRelatedProducts } from "@/lib/products"
import ProductCard from "@/components/products/product-card"

interface RelatedProductsProps {
  productId: string
  categoryId: string
}

export default async function RelatedProducts({ productId, categoryId }: RelatedProductsProps) {
  const relatedProducts = await getRelatedProducts(productId, categoryId)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {relatedProducts.map((product) => {
        // Get the primary category for the product URL
        const primaryCategory = product.categories[0]
        const productUrl = primaryCategory
          ? `/products/${primaryCategory.slug}/${product.slug}`
          : `/products/uncategorized/${product.slug}`

        // Get the primary image
        const primaryImage =
          product.images.length > 0
            ? product.images.sort((a, b) => (a.position || 0) - (b.position || 0))[0].url
            : "/placeholder.svg?height=400&width=400"

        return (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            slug={product.slug}
            price={product.price}
            compareAtPrice={product.compare_at_price || undefined}
            imageSrc={primaryImage}
            category={primaryCategory?.slug || "uncategorized"}
            url={productUrl}
          />
        )
      })}
    </div>
  )
}

