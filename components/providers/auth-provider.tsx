"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { createClientSupabaseClient, type UserProfile } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

type AuthContextType = {
  user: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signUp: (
    email: string,
    password: string,
    metadata?: { full_name?: string },
  ) => Promise<{
    error: Error | null
    success: boolean
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: Error | null
    success: boolean
  }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientSupabaseClient()

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data as UserProfile
  }

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true)

      // Get session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id)
        setUser(profile)
      }

      setIsLoading(false)

      // Set up auth state change listener
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange(async (event, session) => {
        setSession(session)

        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }

        // Handle auth state changes
        if (event === "SIGNED_IN" && pathname === "/account/login") {
          router.push("/account")
        } else if (event === "SIGNED_OUT") {
          router.push("/")
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    initializeAuth()
  }, [supabase, router, pathname])

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      return {
        error,
        success: !error,
      }
    } catch (error) {
      console.error("Sign in error:", error)
      return {
        error: error as Error,
        success: false,
      }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, metadata?: { full_name?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      return {
        error,
        success: !error,
      }
    } catch (error) {
      console.error("Sign up error:", error)
      return {
        error: error as Error,
        success: false,
      }
    }
  }

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account/reset-password`,
      })

      return {
        error,
        success: !error,
      }
    } catch (error) {
      console.error("Reset password error:", error)
      return {
        error: error as Error,
        success: false,
      }
    }
  }

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

