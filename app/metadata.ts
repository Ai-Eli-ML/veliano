import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Veliano - Premium Products",
    template: "%s | Veliano"
  },
  description: "Discover high-quality products at Veliano, your destination for premium shopping",
  keywords: ["ecommerce", "premium", "quality", "products", "online shopping"],
  authors: [{ name: "Veliano Team" }],
  creator: "Veliano",
  publisher: "Veliano Inc.",
  robots: "index, follow",
  applicationName: "Veliano Store",
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
    url: true
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://veliano.com",
    title: "Veliano - Premium Products",
    description: "Discover high-quality products at Veliano, your destination for premium shopping",
    siteName: "Veliano",
    images: [
      {
        url: "https://veliano.com/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Veliano - Premium Products"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Veliano - Premium Products",
    description: "Discover high-quality products at Veliano, your destination for premium shopping",
    images: ["https://veliano.com/images/twitter-image.jpg"],
    creator: "@veliano"
  }
}
