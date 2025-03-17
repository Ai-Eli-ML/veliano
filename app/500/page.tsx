import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Server Error | Veliano Jewelry",
  description: "An unexpected error occurred on our server.",
};

export default function ServerErrorPage() {
  return (
    <main className="container flex flex-col items-center justify-center min-h-[70vh] py-12 text-center px-4">
      <h1 className="text-6xl font-bold mb-4">500</h1>
      <h2 className="text-2xl font-semibold mb-6">Server Error</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We're sorry, but something went wrong on our end. Our team has been notified and is working to fix the issue.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            Return Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">
            Browse Products
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact">
            Contact Support
          </Link>
        </Button>
      </div>
      <div className="mt-12 p-6 border rounded-lg max-w-md">
        <h3 className="text-lg font-medium mb-3">While you wait</h3>
        <p className="text-muted-foreground mb-4">
          You might want to try one of these popular pages:
        </p>
        <ul className="space-y-2 text-left">
          <li>
            <Link href="/products/grillz" className="text-primary hover:underline">
              → Custom Grillz
            </Link>
          </li>
          <li>
            <Link href="/products/jewelry" className="text-primary hover:underline">
              → Jewelry Collection
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-primary hover:underline">
              → Frequently Asked Questions
            </Link>
          </li>
          <li>
            <Link href="/how-it-works" className="text-primary hover:underline">
              → How It Works
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
} 