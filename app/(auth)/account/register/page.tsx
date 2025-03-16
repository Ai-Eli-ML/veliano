"use client"

import type { Metadata } from "next"
import Link from "next/link"
import RegisterForm from "@/components/auth/register-form"

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new Custom Gold Grillz account",
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your details to create a new account</p>
      </div>
      <RegisterForm />
      <div className="text-center text-sm">
        <p>
          Already have an account?{" "}
          <Link href="/account/login" className="font-medium text-primary underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

