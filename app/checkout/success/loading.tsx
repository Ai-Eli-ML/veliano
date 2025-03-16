"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="container py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Loader2 className="h-10 w-10 animate-spin text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Processing Order...</CardTitle>
          <CardDescription>
            Please wait while we confirm your order details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border p-4 space-y-4">
            {/* Order number and date skeleton */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
              </div>
              <div className="space-y-2 text-right">
                <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                <div className="h-5 w-28 bg-muted rounded animate-pulse" />
              </div>
            </div>

            {/* Order items skeleton */}
            <div className="space-y-3 pt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-5 w-8 bg-muted rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>

            {/* Order totals skeleton */}
            <div className="mt-4 border-t pt-4 space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </CardFooter>
      </Card>
    </div>
  )
}

