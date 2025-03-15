"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSearch } from "@/hooks/use-search"
import { SearchResults } from "@/components/search/search-results"
import { SearchIcon, X, Loader2 } from "lucide-react"

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const { query, setQuery, category, setCategory, results, isLoading } = useSearch()
  const [searchInputValue, setSearchInputValue] = useState("")

  // Reset search input when dialog opens
  useEffect(() => {
    if (open) {
      setSearchInputValue("")
      setQuery("")
    }
  }, [open, setQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setQuery(searchInputValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close on escape
    if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  const handleResultClick = (url: string) => {
    router.push(url)
    onOpenChange(false)
  }

  const handleViewAll = () => {
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ""}`)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for products..."
                className="pl-9"
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {searchInputValue && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
                  onClick={() => setSearchInputValue("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear</span>
                </Button>
              )}
            </div>
            <Button type="submit">Search</Button>
          </form>

          <Tabs defaultValue="all" onValueChange={(value) => setCategory(value === "all" ? null : value)}>
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="grillz">Grillz</TabsTrigger>
              <TabsTrigger value="jewelry">Jewelry</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative min-h-[200px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <SearchResults results={results} onResultClick={handleResultClick} />

                {results.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button variant="outline" onClick={handleViewAll}>
                      View all results
                    </Button>
                  </div>
                )}

                {query && results.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-3">
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No results found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      We couldn't find any products matching "{query}"
                    </p>
                  </div>
                )}
              </ScrollArea>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

