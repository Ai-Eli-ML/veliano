import Link from "next/link"
import type { Product } from "@/types/product"
import ProductCard from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProductGridProps {
  products: Product[]
  currentPage: number
  totalPages: number
}

export function ProductGrid({ products, currentPage, totalPages }: ProductGridProps) {
  // Generate pagination links
  const getPaginationLinks = () => {
    const links = []

    // Previous page
    if (currentPage > 1) {
      links.push(
        <Link key="prev" href={{ query: { page: currentPage - 1 } }} scroll={false}>
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
        </Link>,
      )
    } else {
      links.push(
        <Button key="prev" variant="outline" size="icon" disabled>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous page</span>
        </Button>,
      )
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        links.push(
          <Link key={i} href={{ query: { page: i } }} scroll={false}>
            <Button
              variant={i === currentPage ? "default" : "outline"}
              className={i === currentPage ? "bg-primary text-primary-foreground" : ""}
            >
              {i}
            </Button>
          </Link>,
        )
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        links.push(
          <Button key={i} variant="outline" disabled>
            ...
          </Button>,
        )
      }
    }

    // Next page
    if (currentPage < totalPages) {
      links.push(
        <Link key="next" href={{ query: { page: currentPage + 1 } }} scroll={false}>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </Link>,
      )
    } else {
      links.push(
        <Button key="next" variant="outline" size="icon" disabled>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next page</span>
        </Button>,
      )
    }

    return links
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-10 text-center">
        <h3 className="mb-2 text-xl font-medium">No products found</h3>
        <p className="mb-6 text-muted-foreground">Try adjusting your search or filter criteria</p>
        <Link href="/products">
          <Button>View All Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
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

      {/* Pagination */}
      {totalPages > 1 && <div className="mt-8 flex justify-center gap-2">{getPaginationLinks()}</div>}
    </div>
  )
}

export default ProductGrid

