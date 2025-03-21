"use client"

import { useEffect, useReducer, useCallback } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'
import { UserProfile, AuthState, AuthAction } from '@/types/user'

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_SESSION':
      return { ...state, session: action.payload }
    case 'CLEAR_USER':
      return { ...state, user: null, session: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function useAuth() {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const supabase = createBrowserSupabaseClient()

  const setUser = useCallback((user: UserProfile) => {
    dispatch({ type: 'SET_USER', payload: user })
  }, [])

  const setSession = useCallback((session: any) => {
    dispatch({ type: 'SET_SESSION', payload: session })
  }, [])

  const clearUser = useCallback(() => {
    dispatch({ type: 'CLEAR_USER' })
  }, [])

  const setError = useCallback((error: { message: string; status?: number }) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      clearError()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.session) {
        setSession(data.session)
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single()

        if (profile) {
          setUser(profile as UserProfile)
        }
      }
    } catch (error: any) {
      setError({
        message: error.message || 'An error occurred during sign in',
        status: error.status,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [setUser, setSession, setError, clearError])

  const signUp = useCallback(async (email: string, password: string, fullName: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      clearError()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await supabase.from('profiles').insert([
          {
            id: data.user.id,
            full_name: fullName,
            email,
          },
        ])
      }
    } catch (error: any) {
      setError({
        message: error.message || 'An error occurred during sign up',
        status: error.status,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [setError, clearError])

  const signOut = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      clearError()

      const { error } = await supabase.auth.signOut()
      if (error) throw error

      clearUser()
    } catch (error: any) {
      setError({
        message: error.message || 'An error occurred during sign out',
        status: error.status,
      })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [clearUser, setError, clearError])

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })

        // Check active session
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          setSession(session)
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser(profile as UserProfile)
          }
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session) {
              setSession(session)
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
      .single()

              if (profile) {
                setUser(profile as UserProfile)
              }
            } else {
              clearUser()
            }
          }
        )

        return () => {
          subscription.unsubscribe()
        }
      } catch (error: any) {
        setError({
          message: error.message || 'An error occurred during authentication',
          status: error.status,
        })
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [setUser, setSession, clearUser, setError])

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut,
    clearError,
  }
} 