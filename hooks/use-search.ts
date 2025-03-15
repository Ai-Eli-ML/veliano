"use client"

import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import type { Product } from "@/types/product"

export function useSearch() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<string | null>(null)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  const search = useCallback(async (searchQuery: string, categoryFilter?: string | null) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults([])
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        q: searchQuery,
      })

      if (categoryFilter) {
        params.append("category", categoryFilter)
      }

      const response = await fetch(`/api/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Search failed")
      }

      const data = await response.json()
      setResults(data.products)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to perform search")
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Trigger search when debounced query changes
  useEffect(() => {
    search(debouncedQuery, category)
  }, [debouncedQuery, category, search])

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    isLoading,
    error,
    search,
  }
}

