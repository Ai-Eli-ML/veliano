import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple performance monitoring
const startTime = Symbol('startTime')

export async function middleware(req: NextRequest) {
  // Measure performance of middleware
  const start = Date.now()
  ;(req as any)[startTime] = start
  
  // Create supabase middleware client
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Get user session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // URLs for redirects
  const loginUrl = new URL("/account/login", req.url)
  const homeUrl = new URL("/", req.url)
  const currentPath = req.nextUrl.pathname
  
  // Save original URL as redirect parameter
  if (currentPath !== '/account/login') {
    loginUrl.searchParams.set("redirect", currentPath)
  }

  // Authentication check for protected routes
  const isAuthRoute = 
    currentPath.startsWith("/account") && 
    !currentPath.startsWith("/account/login") &&
    !currentPath.startsWith("/account/register") &&
    !currentPath.startsWith("/account/forgot-password") &&
    !currentPath.startsWith("/account/reset-password")
    
  // Login check
  if (isAuthRoute && !session) {
    return NextResponse.redirect(loginUrl)
  }
  
  // Checkout route protection
  if (currentPath.startsWith("/checkout") && !session) {
    return NextResponse.redirect(loginUrl)
  }

  // Admin route protection
  if (currentPath.startsWith("/admin")) {
    // Redirect to login if no session
    if (!session) {
      return NextResponse.redirect(loginUrl)
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from("users")
      .select("is_admin")
      .eq("id", session.user.id)
      .single()

    // Redirect non-admins to home
    if (!profile?.is_admin) {
      return NextResponse.redirect(homeUrl)
    }
  }
  
  // Add timing metrics to response headers for monitoring
  const responseTime = Date.now() - start
  res.headers.set('Server-Timing', `middleware;dur=${responseTime}`)
  
  return res
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
}

