import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function performanceMiddleware(request: NextRequest) {
  const start = performance.now()
  const response = await NextResponse.next()
  const end = performance.now()

  // Calculate basic metrics
  const loadTime = end - start
  const ttfb = response.headers.get("x-response-time") || "0"

  try {
    const supabase = createServerSupabaseClient()
    const url = new URL(request.url)

    // Store performance metrics
    await supabase.from("performance_metrics").insert({
      page: url.pathname,
      load_time: loadTime,
      ttfb: parseFloat(ttfb),
      // Client-side metrics will be updated via API
      fcp: 0,
      lcp: 0,
      cls: 0,
      fid: 0,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error storing performance metrics:", error)
  }

  return response
}

// Client-side performance monitoring
export function initClientPerformance() {
  if (typeof window === "undefined") return

  // Create a PerformanceObserver to monitor FCP
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.name === "first-contentful-paint") {
        reportMetric("fcp", entry.startTime)
      }
    }
  }).observe({ type: "paint", buffered: true })

  // Create a PerformanceObserver to monitor LCP
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      reportMetric("lcp", entry.startTime)
    }
  }).observe({ type: "largest-contentful-paint", buffered: true })

  // Create a PerformanceObserver to monitor CLS
  new PerformanceObserver((entryList) => {
    let clsValue = 0
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value
      }
    }
    reportMetric("cls", clsValue)
  }).observe({ type: "layout-shift", buffered: true })

  // Create a PerformanceObserver to monitor FID
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      reportMetric("fid", entry.processingStart - entry.startTime)
    }
  }).observe({ type: "first-input", buffered: true })
}

async function reportMetric(
  metric: "fcp" | "lcp" | "cls" | "fid",
  value: number
) {
  try {
    const response = await fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metric,
        value,
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  } catch (error) {
    console.error("Error reporting performance metric:", error)
  }
} 