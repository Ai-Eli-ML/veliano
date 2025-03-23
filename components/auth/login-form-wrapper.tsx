"use client"

import dynamic from "next/dynamic";

// Dynamically import the login form to avoid hydration issues
const LoginForm = dynamic(() => import("@/components/auth/login-form"), {
  ssr: false,
});

export default function LoginFormWrapper() {
  return <LoginForm />;
} 