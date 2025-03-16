"use client"

import type { Metadata } from "next"
import Link from "next/link"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Custom Gold Grillz account password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Forgot Password</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>
      <ForgotPasswordForm />
      <div className="text-center text-sm">
        <p>
          Remember your password?{" "}
          <Link href="/account/login" className="font-medium text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

