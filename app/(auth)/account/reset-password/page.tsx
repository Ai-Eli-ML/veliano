"use client"

import type { Metadata } from "next"
import Link from "next/link"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Custom Gold Grillz account",
}

export default function ResetPasswordPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your new password below</p>
      </div>
      <ResetPasswordForm />
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

