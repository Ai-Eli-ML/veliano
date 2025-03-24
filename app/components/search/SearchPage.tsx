'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import SearchFilters from './SearchFilters'
import { trackSearch } from '@/lib/analytics'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)

  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const minPrice = searchParams.get('min') || ''
  const maxPrice = searchParams.get('max') || ''
  const sortBy = searchParams.get('sort') || 'relevance'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const handleSearch = async (newQuery: string) => {
    const params = new URLSearchParams(searchParams)
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset to first page on new search
    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    params.set('page', '1') // Reset to first page on filter change
    router.push(`/search?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
  }

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?${searchParams.toString()}`)
        const data = await response.json()
        
        if (data.success) {
          setResults(data.data.products || [])
          setTotalResults(data.data.totalCount || 0)
          
          // Track search in analytics
          if (query) {
            trackSearch(query, data.data.totalCount)
          }
        } else {
          console.error('Search error:', data.error)
          setResults([])
          setTotalResults(0)
        }
      } catch (error) {
        console.error('Search fetch error:', error)
        setResults([])
        setTotalResults(0)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResults()
  }, [searchParams])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-1">
        <SearchFilters
          currentCategory={category}
          currentMinPrice={minPrice}
          currentMaxPrice={maxPrice}
          currentSort={sortBy}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      <div className="lg:col-span-3">
        <div className="mb-6">
          <SearchBar initialQuery={query} onSearch={handleSearch} />
        </div>
        
        <SearchResults 
          results={results}
          isLoading={isLoading}
          totalResults={totalResults}
          currentPage={page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
} 