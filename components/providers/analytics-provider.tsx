"use client"

import type React from "react"

import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"
import { useEffect } from "react"
import { pageview, GA_TRACKING_ID } from "@/lib/analytics"

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && GA_TRACKING_ID) {
      // Construct the full URL
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")

      // Track pageview
      pageview(url)
    }
  }, [pathname, searchParams])

  if (!GA_TRACKING_ID) {
    return <>{children}</>
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
      {children}
    </>
  )
}

