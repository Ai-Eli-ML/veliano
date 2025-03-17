"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center">
            <Link href="/" className="-m-1.5">
              <Image
                src="/logo.png"
                alt="Logo"
                width={48}
                height={48}
                className="h-8 w-auto"
                priority
              />
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-sm">
          <ForgotPasswordForm />
          
          <p className="mt-8 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/account/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-indigo-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold">Reset your password</h2>
            <p className="mt-4 text-lg">
              We'll send you a secure link to reset your password and get you back to your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
