"use client"

import { useState } from "react"
import { 
  Plus, Trash, ChevronDown, ChevronUp, Copy, Check
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Variant {
  id?: string
  name: string
  price: number
  sku?: string
  inventory_quantity?: number
}

interface ProductVariantFormListProps {
  variants: Variant[]
  onChange: (variants: Variant[]) => void
  basePrice: number
}

export function ProductVariantFormList({
  variants,
  onChange,
  basePrice,
}: ProductVariantFormListProps) {
  const [copySuccess, setCopySuccess] = useState<string | null>(null)

  const addVariant = () => {
    const newVariant: Variant = {
      name: `Variant ${variants.length + 1}`,
      price: basePrice || 0,
      sku: "",
      inventory_quantity: 0,
    }
    onChange([...variants, newVariant])
  }

  const updateVariant = (index: number, data: Partial<Variant>) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], ...data }
    onChange(newVariants)
  }

  const removeVariant = (index: number) => {
    const newVariants = [...variants]
    newVariants.splice(index, 1)
    onChange(newVariants)
  }

  const duplicateVariant = (index: number) => {
    const variantToDuplicate = variants[index]
    const newVariant = {
      ...variantToDuplicate,
      id: undefined,
      name: `${variantToDuplicate.name} (Copy)`,
      sku: variantToDuplicate.sku ? `${variantToDuplicate.sku}-copy` : "",
    }
    onChange([...variants, newVariant])
  }

  const copyVariantSKU = (sku: string) => {
    navigator.clipboard.writeText(sku)
    setCopySuccess(sku)
    setTimeout(() => setCopySuccess(null), 2000)
  }

  const moveVariant = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === variants.length - 1)
    ) {
      return
    }

    const newVariants = [...variants]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    
    // Swap the variants
    [newVariants[index], newVariants[targetIndex]] = [
      newVariants[targetIndex],
      newVariants[index],
    ]
    
    onChange(newVariants)
  }

  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4 border border-dashed rounded-lg">
        <p className="text-sm text-gray-500">No variants added yet</p>
        <Button size="sm" onClick={addVariant}>
          <Plus className="w-4 h-4 mr-2" />
          Add Variant
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {variants.map((variant, index) => (
            <AccordionItem key={index} value={`variant-${index}`}>
              <div className="flex items-center justify-between">
                <AccordionTrigger className="flex-1">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      {variant.name || `Variant ${index + 1}`}
                    </span>
                    <span className="ml-2 text-sm text-gray-500">
                      ${variant.price.toFixed(2)}
                    </span>
                    {variant.sku && (
                      <span className="ml-2 text-xs text-gray-400">
                        SKU: {variant.sku}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <div className="flex items-center space-x-1 px-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveVariant(index, "up")
                    }}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      moveVariant(index, "down")
                    }}
                    disabled={index === variants.length - 1}
                    className="h-8 w-8"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <AccordionContent>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`variant-${index}-name`}>Name</Label>
                        <Input
                          id={`variant-${index}-name`}
                          value={variant.name}
                          onChange={(e) =>
                            updateVariant(index, { name: e.target.value })
                          }
                          placeholder="Variant name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`variant-${index}-price`}>Price</Label>
                        <Input
                          id={`variant-${index}-price`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, {
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 relative">
                        <Label htmlFor={`variant-${index}-sku`}>SKU</Label>
                        <div className="flex">
                          <Input
                            id={`variant-${index}-sku`}
                            value={variant.sku || ""}
                            onChange={(e) =>
                              updateVariant(index, { sku: e.target.value })
                            }
                            placeholder="Stock keeping unit"
                            className="pr-10"
                          />
                          {variant.sku && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-7 h-9"
                              onClick={() => copyVariantSKU(variant.sku || "")}
                            >
                              {copySuccess === variant.sku ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`variant-${index}-inventory`}>
                          Inventory
                        </Label>
                        <Input
                          id={`variant-${index}-inventory`}
                          type="number"
                          min="0"
                          value={variant.inventory_quantity || 0}
                          onChange={(e) =>
                            updateVariant(index, {
                              inventory_quantity: parseInt(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between px-4 py-3 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeVariant(index)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => duplicateVariant(index)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </CardFooter>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={addVariant}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Variant
      </Button>
    </div>
  )
} 