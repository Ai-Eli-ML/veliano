import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { WishlistProvider } from "@/components/providers/wishlist-provider"
import { AnalyticsProvider } from "@/components/providers/analytics-provider"
import { Toaster } from "@/components/ui/toaster"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Custom Gold Grillz | Premium Gold Teeth & Jewelry",
    template: "%s | Custom Gold Grillz",
  },
  description:
    "Shop premium custom gold grillz, gold teeth, and luxury jewelry. Handcrafted with the finest materials for a perfect fit and stunning look.",
  keywords: [
    "gold grillz",
    "custom grillz",
    "gold teeth",
    "custom gold teeth",
    "gold jewelry",
    "luxury jewelry",
    "diamond grillz",
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen`}>
        <ThemeProvider defaultTheme="dark">
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AnalyticsProvider>
                  <div className="flex min-h-screen flex-col bg-black">
                    <Header />
                    <main className="flex-1">{children}</main>
                    <Footer />
                  </div>
                  <Toaster />
                </AnalyticsProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

