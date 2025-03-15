"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart, type CartItem as CartItemType } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus } from "lucide-react"
import { useState } from "react"
import { formatCurrency } from "@/lib/utils"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (value: number) => {
    if (value < 1) return
    if (value > 10) return

    setQuantity(value)
    updateQuantity(item.id, value)
  }

  const handleRemove = () => {
    removeItem(item.id)
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
          <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
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
              disabled={quantity <= 1}
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
            />
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-l-none"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 10}
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
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  )
}

