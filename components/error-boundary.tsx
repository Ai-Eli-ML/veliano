"use client"

import { Component, ErrorInfo, ReactNode } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public async componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)

    try {
      const supabase = createClientComponentClient()

      await supabase.from("error_logs").insert({
        error_message: error.message,
        error_stack: error.stack || "",
        path: window.location.pathname,
        browser: navigator.userAgent,
        os: navigator.platform
      })
    } catch (err) {
      console.error("Error logging to Supabase:", err)
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold">Something went wrong</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                We've logged the error and will look into it. Please try refreshing the page.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className="mt-4 p-4 bg-muted rounded text-xs overflow-x-auto">
                  {this.state.error.message}
                  {"\n"}
                  {this.state.error.stack}
                </pre>
              )}
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
} 