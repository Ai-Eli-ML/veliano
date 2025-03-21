"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="container max-w-screen-xl py-16">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto flex justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-destructive"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold tracking-tight">Something went wrong!</h1>
              <p className="mt-2 text-lg text-muted-foreground">
                We apologize for the inconvenience. Please try again.
              </p>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button onClick={reset}>Try again</Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
