"use client"

import { LoginForm } from "@/components/auth/login-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link
              href="/account/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-sm">
          <LoginForm />
          
          <p className="mt-8 text-center text-sm text-gray-600">
            <Link
              href="/account/forgot-password"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Forgot your password?
            </Link>
          </p>
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-indigo-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold">Welcome back</h2>
            <p className="mt-4 text-lg">
              Sign in to your account to access your orders, profile, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
