'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Error from 'next/error'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold">Something went wrong</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We've logged the error and will look into it. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && error && (
                <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-x-auto">
                  {error.message}
                  {"\n"}
                  {error.stack}
                </pre>
              )}
              <button
                onClick={() => reset()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 