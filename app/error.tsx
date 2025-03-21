"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        {error.message || 'An unexpected error occurred'}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={() => reset()}
          variant="outline"
        >
          Try again
        </Button>
        <Button
          onClick={() => window.location.href = '/'}
          variant="default"
        >
          Return Home
        </Button>
      </div>
    </div>
  )
} 