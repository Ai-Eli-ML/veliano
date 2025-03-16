"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart, type CartItem as CartItemType } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, Loader2 } from "lucide-react"
import { Suspense, useState, useTransition } from "react"
import { formatCurrency } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
}

function CartItemContent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)
  const [isPending, startTransition] = useTransition()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = (value: number) => {
    if (value < 1 || value > 10) return
    
    // Optimistic update
    setQuantity(value)
    startTransition(() => {
      updateQuantity(item.id, value)
    })
  }

  const handleRemove = () => {
    setIsRemoving(true)
    removeItem(item.id)
  }

  if (isRemoving) {
    return (
      <div className="flex h-24 items-center justify-center rounded-lg border p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Link href={`/products/${item.productId}`}>
          <Image
            src={item.image || "/placeholder.svg?height=96&width=96"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <Link href={`/products/${item.productId}`} className="font-medium hover:underline">
            {item.name}
          </Link>
          <span className="font-medium">{formatCurrency(item.price * quantity)}</span>
        </div>

        <div className="mt-1 text-sm text-muted-foreground">
          {item.options &&
            Object.entries(item.options).map(([key, value]) => (
              <div key={key}>
                {key}: {value}
              </div>
            ))}
          <div>Price: {formatCurrency(item.price)}</div>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-r-none"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <Input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
              className="h-8 w-12 rounded-none border-x-0 text-center"
              disabled={isPending}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10 || isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-1 h-4 w-4" />
            )}
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CartItem(props: CartItemProps) {
  return (
    <Suspense fallback={
      <div className="flex h-24 items-center justify-center rounded-lg border p-4">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    }>
      <CartItemContent {...props} />
    </Suspense>
  )
}

