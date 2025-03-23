"use client"

import type React from "react"
import { Suspense, useState } from "react"
import { useCart } from "@/hooks/use-cart"
import { CartContent } from "@/components/cart/cart-content"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Loader2 } from "lucide-react"
import { ErrorBoundary } from "react-error-boundary"

interface CartSheetProps {
  children?: React.ReactNode
}

function CartSheetContent({ children }: CartSheetProps) {
  const { totalItems } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative" aria-label="Open cart">
            <ShoppingCart className="h-5 w-5" />
            {totalItems() > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {totalItems()}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Shopping Cart ({totalItems()})</SheetTitle>
        </SheetHeader>
        
        <CartContent onClose={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}

function CartError({ error }: { error: Error }) {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
      <Button variant="outline" onClick={() => window.location.reload()}>
        Try again
      </Button>
    </div>
  )
}

export function CartSheet(props: CartSheetProps) {
  return (
    <ErrorBoundary FallbackComponent={CartError}>
      <Suspense fallback={
        <Button variant="ghost" size="icon" className="relative" aria-label="Loading cart">
          <Loader2 className="h-5 w-5 animate-spin" />
        </Button>
      }>
        <CartSheetContent {...props} />
      </Suspense>
    </ErrorBoundary>
  )
}

