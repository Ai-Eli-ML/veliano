"use client"

import { useState, useEffect, useCallback } from "react"

type ScrollDirection = "up" | "down" | null

interface UseScrollOptions {
  threshold?: number
  initialDirection?: ScrollDirection
}

interface UseScrollReturn {
  scrollY: number
  scrollX: number
  scrollDirection: ScrollDirection
  isScrolled: boolean
  isScrolledToBottom: boolean
  scrollTo: (options: ScrollToOptions) => void
  scrollToTop: () => void
  scrollToBottom: () => void
}

export function useScroll({ threshold = 10, initialDirection = null }: UseScrollOptions = {}): UseScrollReturn {
  const [scrollY, setScrollY] = useState(0)
  const [scrollX, setScrollX] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>(initialDirection)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false)

  const handleScroll = useCallback(() => {
    if (typeof window === "undefined") return

    const currentScrollY = window.scrollY
    const currentScrollX = window.scrollX
    const previousScrollY = scrollY

    // Update scroll position
    setScrollY(currentScrollY)
    setScrollX(currentScrollX)

    // Determine if page is scrolled
    setIsScrolled(currentScrollY > 0)

    // Determine scroll direction
    if (Math.abs(currentScrollY - previousScrollY) > threshold) {
      const direction = currentScrollY > previousScrollY ? "down" : "up"
      setScrollDirection(direction)
    }

    // Check if scrolled to bottom
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrolledToBottom = currentScrollY + windowHeight >= documentHeight - threshold

    setIsScrolledToBottom(scrolledToBottom)
  }, [scrollY, threshold])

  // Scroll to specific position
  const scrollTo = useCallback((options: ScrollToOptions) => {
    if (typeof window === "undefined") return
    window.scrollTo(options)
  }, [])

  // Scroll to top
  const scrollToTop = useCallback(() => {
    scrollTo({ top: 0, behavior: "smooth" })
  }, [scrollTo])

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return

    const documentHeight = document.documentElement.scrollHeight
    scrollTo({ top: documentHeight, behavior: "smooth" })
  }, [scrollTo])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Set initial values
    handleScroll()

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  return {
    scrollY,
    scrollX,
    scrollDirection,
    isScrolled,
    isScrolledToBottom,
    scrollTo,
    scrollToTop,
    scrollToBottom,
  }
}

