"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase-client"

function VerifyPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = createBrowserSupabaseClient()

        // Get the token from the URL
        const token = searchParams.get("token")
        const type = searchParams.get("type")

        if (!token || type !== "signup") {
          setVerificationStatus("error")
          setErrorMessage("Invalid verification link")
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        })

        if (error) {
          throw error
        }

        setVerificationStatus("success")
      } catch (error: any) {
        console.error("Error verifying email:", error)
        setVerificationStatus("error")
        setErrorMessage(error?.message || "Failed to verify email")
      }
    }

    verifyEmail()
  }, [searchParams])

  return (
    <div className="container flex min-h-[600px] items-center justify-center py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Email Verification</CardTitle>
          <CardDescription>
            {verificationStatus === "loading"
              ? "Verifying your email address..."
              : verificationStatus === "success"
              ? "Your email has been verified"
              : "Email verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {verificationStatus === "loading" ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : verificationStatus === "success" ? (
            <>
              <CheckCircle className="h-8 w-8 text-green-500" />
              <p className="text-center text-sm text-muted-foreground">
                Thank you for verifying your email address. You can now log in to your account.
              </p>
              <Button onClick={() => router.push("/account/login")} className="w-full">
                Continue to Login
              </Button>
            </>
          ) : (
            <>
              <XCircle className="h-8 w-8 text-destructive" />
              <p className="text-center text-sm text-muted-foreground">{errorMessage}</p>
              <Button onClick={() => router.push("/account/register")} variant="outline" className="w-full">
                Back to Registration
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="container flex min-h-[600px] items-center justify-center py-10">
        <Card className="mx-auto max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto h-6 w-40 animate-pulse rounded bg-muted" />
            <div className="mx-auto mt-2 h-4 w-60 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyPageContent />
    </Suspense>
  )
} 