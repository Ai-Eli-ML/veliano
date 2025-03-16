'use client'

import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
}

function PaginationContent({ currentPage, totalPages, totalItems }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots = []
    let l

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    }

    return rangeWithDots
  }

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
        >
          <Link href={createPageURL(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        {getPageNumbers().map((pageNumber, i) => (
          pageNumber === '...' ? (
            <span key={`dots-${i}`} className="px-3 py-2">...</span>
          ) : (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              asChild
            >
              <Link href={createPageURL(pageNumber)} aria-label={`Page ${pageNumber}`}>
                {pageNumber}
              </Link>
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="icon"
          asChild
          disabled={currentPage >= totalPages}
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
    <Suspense fallback={<div>Loading pagination...</div>}>
      <PaginationContent {...props} />
    </Suspense>
  )
} 