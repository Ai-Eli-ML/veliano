import { Metadata } from "next";
import LoginFormWrapper from "@/components/auth/login-form-wrapper";

export const metadata: Metadata = {
  title: "Login | Veliano Jewelry",
  description: "Sign in to your Veliano account to access your orders, manage your profile, and more.",
};

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <LoginFormWrapper />
    </div>
  );
} 