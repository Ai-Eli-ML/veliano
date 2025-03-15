"use client"

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("config", GA_TRACKING_ID, {
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
  if (typeof window !== "undefined" && (window as any).gtag) {
    ;(window as any).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// E-commerce specific events
export const ecommerceEvent = {
  viewItem: (item: any) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "view_item", {
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

  addToCart: (item: any, quantity: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "add_to_cart", {
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

  removeFromCart: (item: any, quantity: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "remove_from_cart", {
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

  beginCheckout: (items: any[], value: number) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "begin_checkout", {
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

  purchase: (transaction: any) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      ;(window as any).gtag("event", "purchase", {
        transaction_id: transaction.id,
        value: transaction.value,
        currency: "USD",
        tax: transaction.tax,
        shipping: transaction.shipping,
        items: transaction.items.map((item: any) => ({
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

