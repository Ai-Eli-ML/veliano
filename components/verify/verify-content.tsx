"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"

export default function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")
  
  const token = searchParams?.get("token")
  
  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("Missing verification token")
      setIsLoading(false)
      return
    }
    
    // In a real implementation, this would verify with Supabase
    // const verifyEmail = async () => {
    //   const supabase = createClient()
    //   
    //   const { error } = await supabase.auth.verifyOtp({
    //     token_hash: token,
    //     type: "email",
    //   })
    //   
    //   if (error) throw error
    //   return true
    // }
    
    // Simulate verification
    const verifyEmail = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate successful verification (in real app, check against Supabase)
      return true
    }
    
    verifyEmail()
      .then(() => {
        setStatus("success")
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Verification error:", error)
        setStatus("error")
        setErrorMessage(error.message || "Failed to verify email. Please try again.")
        setIsLoading(false)
      })
  }, [token])
  
  return (
    <Card className="mt-6">
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
          <Alert className="mb-4 border-green-500 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your email has been verified. You can now sign in to your account.
            </AlertDescription>
          </Alert>
        )}
        
        {status === "error" && (
          <Alert className="mb-4 border-destructive" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {errorMessage}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mt-6 flex gap-4">
          {status === "success" && (
            <Button asChild>
              <Link href="/account/login">Sign In</Link>
            </Button>
          )}
          
          {status === "error" && (
            <>
              <Button asChild variant="outline">
                <Link href="/">Go Home</Link>
              </Button>
              <Button asChild>
                <Link href="/account/login">Try Again</Link>
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 