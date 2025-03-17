"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordSkeleton />}>
      <ResetPasswordContent />
    </Suspense>
  )
}

function ResetPasswordSkeleton() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          <div className="flex justify-center">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="mt-6 h-8 w-full" />
          <Skeleton className="mt-2 h-4 w-3/4 mx-auto" />
        </div>

        <div className="mt-8 mx-auto w-full max-w-sm space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="mt-8 h-4 w-3/4 mx-auto" />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-indigo-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>
    </div>
  )
}

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams?.get("token") || ""

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md text-center">
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
            Invalid or Missing Token
          </h2>
          <p className="mt-2 text-gray-600">
            The password reset link is invalid or has expired. Please request a new
            password reset link.
          </p>
          <div className="mt-6">
            <Link
              href="/account/forgot-password"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Request a new link
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Create a new password for your account
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-sm">
          <ResetPasswordForm token={token} />
          
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
              Create a new secure password to protect your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
