import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Veliano Jewelry",
  description: "Login to your Veliano account to access your profile, orders, and more.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 