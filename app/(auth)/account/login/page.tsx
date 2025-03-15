import type { Metadata } from "next"
import Link from "next/link"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your Custom Gold Grillz account",
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-gray-500 dark:text-gray-400">Enter your email and password to login to your account</p>
      </div>
      <LoginForm />
      <div className="text-center text-sm">
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/account/register" className="font-medium text-primary underline">
            Register
          </Link>
        </p>
        <p className="mt-2">
          <Link href="/account/forgot-password" className="font-medium text-primary underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  )
}

