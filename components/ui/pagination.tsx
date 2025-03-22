'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function PaginationContent({ currentPage, totalPages, totalItems, onPageChange, siblingCount = 1 }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = []
    
    // Always show first page
    pageNumbers.push(1)
    
    // Calculate range around current page
    const leftSibling = Math.max(2, currentPage - siblingCount)
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount)
    
    // Add dots if needed before left sibling
    if (leftSibling > 2) {
      pageNumbers.push(-1) // -1 represents dots
    }
    
    // Add pages around current page
    for (let i = leftSibling; i <= rightSibling; i++) {
      pageNumbers.push(i)
    }
    
    // Add dots if needed after right sibling
    if (rightSibling < totalPages - 1) {
      pageNumbers.push(-2) // -2 represents dots (different key)
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages)
    }
    
    return pageNumbers
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <p className="text-sm text-muted-foreground">
        Showing page {currentPage} of {totalPages} ({totalItems} items)
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          asChild
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Link href={createPageURL(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        {pageNumbers.map((pageNumber, i) => {
          // Render dots
          if (pageNumber < 0) {
            return (
              <Button
                key={pageNumber}
                variant="ghost"
                size="icon"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            )
          }
          
          // Render page number
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              asChild
              onClick={() => onPageChange(pageNumber)}
              disabled={currentPage === pageNumber}
            >
              <Link href={createPageURL(pageNumber)} aria-label={`Page ${pageNumber}`}>
                {pageNumber}
              </Link>
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="icon"
          asChild
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Link href={createPageURL(currentPage + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

export function Pagination(props: PaginationProps) {
  return (
    <div>Loading pagination...</div>
  )
} 