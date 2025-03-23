"use client"

import { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoginForm from "@/components/auth/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Login | Veliano Jewelry",
  description: "Login to your Veliano account to access your profile, orders, and more.",
};

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [showRegisteredMessage, setShowRegisteredMessage] = useState(false);
  
  useEffect(() => {
    if (searchParams?.get("registered") === "true") {
      setShowRegisteredMessage(true);
    }
  }, [searchParams]);
  
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {showRegisteredMessage && (
        <Alert className="max-w-md mb-4 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            Account created successfully. Please check your email for a verification link before signing in.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm />
    </div>
  );
} 