import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

const publicRoutes = [
  '/',
  '/about',
  '/products',
  '/categories',
  '/auth/signin',
  '/auth/signup',
  '/auth/reset-password',
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const isPublicRoute = publicRoutes.some(route => req.nextUrl.pathname.startsWith(route))
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')
  const isAuthRoute = req.nextUrl.pathname.startsWith('/auth')

  // Allow public routes and API routes
  if (isPublicRoute || isApiRoute) {
    return res
  }

  // Redirect authenticated users away from auth routes
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/account', req.url))
  }

  // Redirect unauthenticated users to signin
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

