"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function ProductSortContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get current sort value from URL
  const currentSort = searchParams.get("sort") || "newest"

  // Handle sort change
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }

    // Reset to page 1 when sort changes
    params.delete("page")

    // Update URL
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium">Sort by:</span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="featured">Featured</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function ProductSort() {
  return (
    <Suspense fallback={
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium">Sort by:</span>
        <div className="h-10 w-[180px] animate-pulse rounded-md bg-muted"></div>
      </div>
    }>
      <ProductSortContent />
    </Suspense>
  )
}

export default ProductSort

