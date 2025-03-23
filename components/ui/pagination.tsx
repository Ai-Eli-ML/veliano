'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
  searchParams?: Record<string, string | undefined>
  siblingCount?: number
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  baseUrl,
  searchParams = {}, 
  siblingCount = 1 
}: PaginationProps) {
  // Create a URL with the given page number, preserving other search params
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams();
    
    // Add all existing search params except page
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        params.set(key, value);
      }
    });
    
    // Set the page parameter
    params.set('page', pageNumber.toString());
    
    // Create the full URL
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ''}`;
  };

  // Create an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Always show first page
    pageNumbers.push(1);
    
    // Calculate range around current page
    const leftSibling = Math.max(2, currentPage - siblingCount);
    const rightSibling = Math.min(totalPages - 1, currentPage + siblingCount);
    
    // Add dots if needed before left sibling
    if (leftSibling > 2) {
      pageNumbers.push(-1); // -1 represents dots
    }
    
    // Add pages around current page
    for (let i = leftSibling; i <= rightSibling; i++) {
      pageNumbers.push(i);
    }
    
    // Add dots if needed after right sibling
    if (rightSibling < totalPages - 1) {
      pageNumbers.push(-2); // -2 represents dots (different key)
    }
    
    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          asChild
          disabled={currentPage <= 1}
        >
          <Link href={createPageURL(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        {pageNumbers.map((pageNumber) => {
          // Render dots
          if (pageNumber < 0) {
            return (
              <Button
                key={pageNumber}
                variant="ghost"
                size="icon"
                className="h-9 w-9"
                disabled
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            );
          }
          
          // Render page number
          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              size="icon"
              className="h-9 w-9"
              asChild
              disabled={currentPage === pageNumber}
            >
              <Link href={createPageURL(pageNumber)} aria-label={`Page ${pageNumber}`}>
                {pageNumber}
              </Link>
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          asChild
          disabled={currentPage >= totalPages}
        >
          <Link href={createPageURL(currentPage + 1)} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
} 