import Link from "next/link"
import type { ProductWithRelations } from "@/types/product"
import ProductCard from "@/components/products/product-card"

interface ProductGridProps {
  products: ProductWithRelations[]
  emptyMessage?: string
}

export default function ProductGrid({ products, emptyMessage = "No products found" }: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-xl font-medium text-gray-600 mb-6">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link 
          key={product.id}
          href={`/products/${product.slug}`}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg group"
        >
          <ProductCard product={product} />
        </Link>
      ))}
    </div>
  )
}

