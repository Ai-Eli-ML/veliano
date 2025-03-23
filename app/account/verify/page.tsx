"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { createBrowserSupabaseClient } from "@/lib/supabase/client"

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = searchParams?.get("token")
        const type = searchParams?.get("type") || "signup"
        
        if (!token) {
          setStatus("error")
          setErrorMessage("Missing verification token")
          setIsLoading(false)
          return
        }
        
        const supabase = createBrowserSupabaseClient()
        
        // Verify the token with Supabase
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type === "recovery" ? "recovery" : "signup",
        })
        
        if (error) {
          console.error("Verification error:", error)
          throw error
        }
        
        setStatus("success")
        setIsLoading(false)
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Failed to verify email. Please try again.")
        setIsLoading(false)
      }
    }
    
    verifyToken()
  }, [searchParams, router])
  
  const handleLogin = () => {
    router.push("/account/login")
  }
  
  return (
    <div className="container max-w-md py-12">
      <h1 className="text-3xl font-bold text-center mb-6">Email Verification</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            {status === "verifying" && "Verifying your email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-center">
            {status === "verifying" && "Please wait while we verify your email address."}
            {status === "success" && "Your email has been successfully verified."}
            {status === "error" && "We encountered an issue while verifying your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {status === "verifying" && (
            <div className="flex flex-col items-center p-6">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="mt-4 text-center text-gray-500">
                This may take a moment...
              </p>
            </div>
          )}
          
          {status === "success" && (
            <>
              <Alert className="mb-4 border-green-500 text-green-700">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Your email has been verified. You can now sign in to your account.
                </AlertDescription>
              </Alert>
              <Button onClick={handleLogin} className="w-full">
                Go to Login
              </Button>
            </>
          )}
          
          {status === "error" && (
            <>
              <Alert className="mb-4 border-destructive" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {errorMessage}
                </AlertDescription>
              </Alert>
              <Button onClick={() => router.push("/account/register")} variant="outline" className="w-full">
                Try Again
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
