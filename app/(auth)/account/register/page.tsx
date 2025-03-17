"use client"

import { RegisterForm } from "@/components/auth/register-form"
import Image from "next/image"
import Link from "next/link"

export default function RegisterPage() {
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
            Create a new account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/account/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-8 mx-auto w-full max-w-sm">
          <RegisterForm />
        </div>
      </div>
      <div className="hidden lg:block relative flex-1 bg-indigo-700">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-xl text-white">
            <h2 className="text-3xl font-bold">Join our community</h2>
            <p className="mt-4 text-lg">
              Create an account to enjoy a personalized shopping experience, track
              orders, and access exclusive offers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
