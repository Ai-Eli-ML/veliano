"use client"

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// Define window with gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      target: string | undefined,
      params?: Record<string, unknown>
    ) => void
  }
}

// Define types for analytics data
interface AnalyticsItem {
  id: string
  name: string
  price: number
  category: string
  variant?: string
  quantity?: number
}

interface Transaction {
  id: string
  value: number
  tax: number
  shipping: number
  items: AnalyticsItem[]
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce specific events
export const ecommerceEvent = {
  viewItem: (item: AnalyticsItem) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "view_item", {
        currency: "USD",
        value: item.price,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            item_category: item.category,
            item_variant: item.variant,
          },
        ],
      })
    }
  },

  addToCart: (item: AnalyticsItem, quantity: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "add_to_cart", {
        currency: "USD",
        value: item.price * quantity,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            item_category: item.category,
            item_variant: item.variant,
            quantity: quantity,
          },
        ],
      })
    }
  },

  removeFromCart: (item: AnalyticsItem, quantity: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "remove_from_cart", {
        currency: "USD",
        value: item.price * quantity,
        items: [
          {
            item_id: item.id,
            item_name: item.name,
            price: item.price,
            item_category: item.category,
            item_variant: item.variant,
            quantity: quantity,
          },
        ],
      })
    }
  },

  beginCheckout: (items: AnalyticsItem[], value: number) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "begin_checkout", {
        currency: "USD",
        value: value,
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          item_variant: item.variant,
          quantity: item.quantity,
        })),
      })
    }
  },

  purchase: (transaction: Transaction) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "purchase", {
        transaction_id: transaction.id,
        value: transaction.value,
        currency: "USD",
        tax: transaction.tax,
        shipping: transaction.shipping,
        items: transaction.items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          item_category: item.category,
          item_variant: item.variant,
          quantity: item.quantity,
        })),
      })
    }
  },
}

