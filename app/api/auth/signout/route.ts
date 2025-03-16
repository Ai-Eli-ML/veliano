import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = createServerClient({ cookies })

  // Sign out the user
  await supabase.auth.signOut()

  // Redirect to the home page
  return NextResponse.redirect(new URL("/", request.url), {
    status: 302,
  })
}

