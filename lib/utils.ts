import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return ""

  const parts = name.split(" ").filter(Boolean)

  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

// Format currency
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount)
}

// Format date
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const dateToFormat = typeof date === "string" ? new Date(date) : date

  return new Intl.DateTimeFormat("en-US", options || defaultOptions).format(dateToFormat)
}

