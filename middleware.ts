import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

// Simple performance monitoring
const startTime = Symbol('startTime')

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.delete({
            name,
            ...options,
          })
        },
      },
    }
  )

  const start = Date.now()

  try {
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error) {
      throw error
    }

    // Check if we're on a protected route
    const isProtectedRoute = (
      request.nextUrl.pathname.startsWith("/account") &&
      !request.nextUrl.pathname.startsWith("/account/login") &&
      !request.nextUrl.pathname.startsWith("/account/register") &&
      !request.nextUrl.pathname.startsWith("/account/forgot-password")
    ) ||
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/checkout")

    // If it's a protected route and there's no session, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL("/account/login", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If it's an admin route, check if the user is an admin
    if (request.nextUrl.pathname.startsWith("/admin")) {
      if (!session?.user?.id) {
        return NextResponse.redirect(new URL("/", request.url))
      }

      const { data: profile } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", session.user.id)
        .single()

      if (!profile?.is_admin) {
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    // Add server timing header
    const end = Date.now()
    response.headers.set("Server-Timing", `auth;dur=${end - start}`)

    return response
  } catch (error) {
    console.error("Auth error:", error)
    return response
  }
}

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/checkout/:path*",
  ],
}

