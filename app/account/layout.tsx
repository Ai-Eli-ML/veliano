import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Veliano Jewelry",
  description: "Manage your Veliano Jewelry account settings and preferences",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 