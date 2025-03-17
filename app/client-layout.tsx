"use client"

import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { WishlistProvider } from "@/components/providers/wishlist-provider"
import { initClientPerformance } from "@/middleware/performance"
import { useEffect } from "react"






