"use client"

import { PageHeading } from "@/components/ui/page-heading"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HowItWorksPage() {
  return (
    <div className="container max-w-screen-xl py-12">
      <PageHeading
        title="How It Works"
        description="Learn about our process and what makes us different"
        className="text-center mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Premium Quality Products</h2>
          <p className="text-gray-600 mb-6">
            We source only the highest quality materials for our products. Each item is carefully crafted to ensure durability, comfort, and style that lasts.
          </p>
          <p className="text-gray-600">
            Our commitment to quality means we stand behind everything we sell with our satisfaction guarantee and industry-leading warranty.
          </p>
        </div>
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <Image
            src="/images/quality.jpg"
            alt="Premium quality products"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Browse</CardTitle>
            <CardDescription>Explore our collection</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Browse our extensive catalog of products. Use filters to find exactly what you're looking for based on category, price, or features.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Select</CardTitle>
            <CardDescription>Choose your perfect match</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Select the products that meet your needs. Read detailed descriptions, view high-quality images, and check customer reviews.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Checkout</CardTitle>
            <CardDescription>Quick and secure payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Complete your purchase with our secure checkout process. Choose from multiple payment options and get your order confirmation instantly.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Ready to Experience the Difference?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Join thousands of satisfied customers who have discovered the quality and convenience of shopping with us.
        </p>
        <Button asChild size="lg">
          <Link href="/products">
            Shop Now
          </Link>
        </Button>
      </div>

      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <h3 className="font-semibold mb-2">How long does shipping take?</h3>
            <p className="text-gray-600">
              Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout for faster delivery.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What is your return policy?</h3>
            <p className="text-gray-600">
              We offer a 30-day return policy on most items. Please visit our Returns & Exchanges page for more details.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
            <p className="text-gray-600">
              Yes, we ship to most countries worldwide. International shipping times and fees vary by location.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How can I track my order?</h3>
            <p className="text-gray-600">
              Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
