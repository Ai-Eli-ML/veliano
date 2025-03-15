import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Authentication check for protected routes
  if (
    !session &&
    req.nextUrl.pathname.startsWith("/account") &&
    !req.nextUrl.pathname.startsWith("/account/login") &&
    !req.nextUrl.pathname.startsWith("/account/register") &&
    !req.nextUrl.pathname.startsWith("/account/forgot-password") &&
    !req.nextUrl.pathname.startsWith("/account/reset-password")
  ) {
    const redirectUrl = new URL("/account/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin check for admin routes
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      const redirectUrl = new URL("/account/login", req.url)
      redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    const { data: profile } = await supabase.from("users").select("is_admin").eq("id", session.user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: ["/account/:path*", "/admin/:path*", "/checkout/:path*"],
}

