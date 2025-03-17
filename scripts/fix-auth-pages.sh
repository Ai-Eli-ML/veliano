#!/bin/bash

# Initialize log file
LOG_FILE="auth-pages-fixes-log.txt"
echo "Starting auth pages fixes at $(date)" > "$LOG_FILE"

# Function to log messages
log_message() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Fix auth pages with type errors
fix_auth_pages() {
  local auth_dir="./app/(auth)/account"
  
  if [ -d "$auth_dir" ]; then
    log_message "Fixing auth pages in $auth_dir"
    
    # Fix forgot-password page
    local forgot_password="$auth_dir/forgot-password/page.tsx"
    if [ -f "$forgot_password" ]; then
      log_message "Fixing $forgot_password"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Create proper component
      cat > "$temp_file" << EOF
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
EOF
      
      # Replace the original file
      mv "$temp_file" "$forgot_password"
      log_message "Fixed $forgot_password"
    fi
    
    # Fix login page
    local login="$auth_dir/login/page.tsx"
    if [ -f "$login" ]; then
      log_message "Fixing $login"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Create proper component
      cat > "$temp_file" << EOF
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
EOF
      
      # Replace the original file
      mv "$temp_file" "$login"
      log_message "Fixed $login"
    fi
    
    # Fix register page
    local register="$auth_dir/register/page.tsx"
    if [ -f "$register" ]; then
      log_message "Fixing $register"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Create proper component
      cat > "$temp_file" << EOF
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
EOF
      
      # Replace the original file
      mv "$temp_file" "$register"
      log_message "Fixed $register"
    fi
    
    # Fix reset-password page
    local reset_password="$auth_dir/reset-password/page.tsx"
    if [ -f "$reset_password" ]; then
      log_message "Fixing $reset_password"
      
      # Create a temporary file
      temp_file=$(mktemp)
      
      # Create proper component
      cat > "$temp_file" << EOF
"use client"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function ResetPasswordPage() {
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
EOF
      
      # Replace the original file
      mv "$temp_file" "$reset_password"
      log_message "Fixed $reset_password"
    fi
    
    log_message "Fixed all auth pages in $auth_dir"
  else
    log_message "Auth directory not found: $auth_dir"
  fi
}

# Run the fixes
log_message "Starting auth pages fixes..."
fix_auth_pages
log_message "Completed auth pages fixes at $(date)" 