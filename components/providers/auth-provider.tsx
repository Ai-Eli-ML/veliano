"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"
import type { UserProfile } from "@/types/user"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthState {
  user: UserProfile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createBrowserSupabaseClient()

  const fetchUserProfile = async (userId: string) => {
    if (!userId) return null
    
    try {
      // First try to get the existing profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      // If we get an error but it's not a "not found" error, log it and return null
      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile:", error)
        return null
      }

      // If we found a profile, return it
      if (data) return data

      // If we didn't find a profile, create one
      const currentUser = await supabase.auth.getUser()
      if (!currentUser.data.user) return null

      const email = currentUser.data.user.email
      if (!email) return null

      const now = new Date().toISOString()
      // Create a new profile
      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          email: email,
          full_name: "",
          created_at: now,
          updated_at: now,
          bio: null,
          address: null,
          website: null,
          phone: null,
          role: null
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return null
      }

      return newProfile
    } catch (error) {
      console.error("Error in profile management:", error)
      return null
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id)
          if (userProfile) {
            setUser({
              ...userProfile,
              id: session.user.id,
              email: session.user.email || userProfile.email,
              full_name: userProfile.full_name || ""
            })
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userProfile = await fetchUserProfile(session.user.id)
        if (userProfile) {
          setUser({
            ...userProfile,
            id: session.user.id,
            email: session.user.email || userProfile.email,
            full_name: userProfile.full_name || ""
          })
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Fetch or create profile
        const userProfile = await fetchUserProfile(data.user.id)
        if (!userProfile) {
          throw new Error("Could not fetch or create user profile")
        }
        
        setUser({
          ...userProfile,
          id: data.user.id,
          email: data.user.email || userProfile.email,
          full_name: userProfile.full_name || ""
        })
        
        router.refresh()
      }
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  const handleSignUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      // First sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        console.error("Signup error:", error)
        throw error
      }

      if (!data.user || !data.user.id) {
        console.error("No user returned from signup")
        throw new Error("Failed to create user account")
      }

      console.log("User created successfully:", data.user.id)

      // Create profile with all required fields matching the database schema exactly
      const now = new Date().toISOString()
      const profileData = {
        id: data.user.id,
        email: data.user.email || email,
        full_name: metadata?.full_name || "",
        created_at: now,
        updated_at: now,
        bio: null,
        address: null,
        website: null,
        phone: null,
        role: null
      }
      
      console.log("Attempting to create profile:", profileData)
      
      const { error: profileError, data: createdProfile } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single()

      if (profileError) {
        console.error("Profile creation error:", profileError)
        throw profileError
      }

      console.log("Profile created successfully:", createdProfile)
      
      // Set user in state if we get this far
      setUser({
        ...createdProfile,
        id: data.user.id,
        email: data.user.email || email,
        full_name: metadata?.full_name || ""
      })

      router.refresh()
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      setUser(null)
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const handleResetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/account/reset-password`,
      })
      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  const value = {
    user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
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

