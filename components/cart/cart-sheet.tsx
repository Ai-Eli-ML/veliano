"use client"

import type React from "react"

import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/components/cart/cart-item"
import { CartEmpty } from "@/components/cart/cart-empty"
import { CartSummary } from "@/components/cart/cart-summary"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart } from "lucide-react"
import { useState } from "react"

interface CartSheetProps {
  children?: React.ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const { items, totalItems } = useCart()
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

        <div className="flex-1 overflow-auto py-4">
          {items.length === 0 ? (
            <CartEmpty />
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t pt-4">
            <CartSummary />
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

