import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Veliano | Luxury Jewelry & Watches",
    template: "%s | Veliano"
  },
  description: "Discover exquisite luxury jewelry and watches at Veliano. Shop our exclusive collections of fine jewelry, designer watches, and accessories.",
  keywords: ["luxury jewelry", "fine watches", "designer jewelry", "engagement rings", "diamond jewelry"],
  authors: [{ name: "Veliano Jewelry" }],
  creator: "Veliano Jewelry",
  publisher: "Veliano Jewelry",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veliano.com",
    title: "Veliano | Luxury Jewelry & Watches",
    description: "Discover exquisite luxury jewelry and watches at Veliano.",
    siteName: "Veliano",
  },
  twitter: {
    card: "summary_large_image",
    title: "Veliano | Luxury Jewelry & Watches",
    description: "Discover exquisite luxury jewelry and watches at Veliano.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-center" closeButton />
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}





