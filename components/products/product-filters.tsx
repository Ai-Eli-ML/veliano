"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { ProductCategory } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { X } from "lucide-react"

interface ProductFiltersProps {
  categories: ProductCategory[]
  currentCategory?: ProductCategory
}

function ProductFiltersContent({ categories, currentCategory }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Parse current filters from URL
  const [minPrice, setMinPrice] = useState<number | undefined>(
    searchParams.has("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
  )
  const [maxPrice, setMaxPrice] = useState<number | undefined>(
    searchParams.has("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  )
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice || 0, maxPrice || 1000])

  // Update price range when min/max price changes
  useEffect(() => {
    setPriceRange([minPrice || 0, maxPrice || 1000])
  }, [minPrice, maxPrice])

  // Apply filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Update price filters
    if (priceRange[0] > 0) {
      params.set("minPrice", priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }

    if (priceRange[1] < 1000) {
      params.set("maxPrice", priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }

    // Reset to page 1 when filters change
    params.delete("page")

    // Update URL
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    // Remove filter params
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("page")

    // Keep sort and search
    const sort = params.get("sort")
    const search = params.get("search")

    params.delete("sort")
    params.delete("search")

    if (sort) params.set("sort", sort)
    if (search) params.set("search", search)

    // Update URL
    router.push(`?${params.toString()}`, { scroll: false })

    // Reset state
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setPriceRange([0, 1000])
  }

  // Check if any filters are active
  const hasActiveFilters = searchParams.has("minPrice") || searchParams.has("maxPrice")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8 text-muted-foreground hover:text-foreground"
          >
            Clear <X className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price"]}>
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={currentCategory?.id === category.id}
                    onCheckedChange={() => {
                      if (currentCategory?.id !== category.id) {
                        router.push(`/products/${category.slug}`)
                      }
                    }}
                  />
                  <Label htmlFor={`category-${category.id}`} className="cursor-pointer text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />

              <div className="flex items-center space-x-4">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="min-price">Min Price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                  />
                </div>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="max-price">Max Price</Label>
                  <Input
                    id="max-price"
                    type="number"
                    min={priceRange[0]}
                    max={1000}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  />
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full">
                Apply Filter
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export function ProductFilters({ categories, currentCategory }: ProductFiltersProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Filters</h2>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-24 rounded bg-muted" />
            <div className="h-40 rounded bg-muted" />
            <div className="h-40 rounded bg-muted" />
          </div>
        </div>
      }
    >
      <ProductFiltersContent categories={categories} currentCategory={currentCategory} />
    </Suspense>
  )
}

export default ProductFilters

