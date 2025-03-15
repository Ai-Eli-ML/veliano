"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchDialog } from "@/components/search/search-dialog"
import { Search } from "lucide-react"

interface SearchButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
}

export function SearchButton({ variant = "ghost", size = "icon" }: SearchButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)} aria-label="Search">
        <Search className="h-5 w-5" />
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

