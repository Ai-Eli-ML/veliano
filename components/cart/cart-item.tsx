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
  readonly?: boolean
}

function CartItemContent({ item, readonly }: CartItemProps) {
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
            src={item.image || "/images/placeholder.jpg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between">
          <div>
            <Link href={`/products/${item.productId}`}>
              <h3 className="font-medium hover:underline">{item.name}</h3>
            </Link>
            {item.options && Object.entries(item.options).map(([key, value]) => (
              <p key={key} className="text-sm text-muted-foreground">
                {key}: {value}
              </p>
            ))}
          </div>
          <p className="font-medium">{formatCurrency(item.price)}</p>
        </div>

        <div className="flex items-center justify-between">
          {!readonly ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isPending}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="h-8 w-16 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10 || isPending}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Quantity: {item.quantity}
            </p>
          )}

          {!readonly && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={handleRemove}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export function CartItem(props: CartItemProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartItemContent {...props} />
    </Suspense>
  )
}

