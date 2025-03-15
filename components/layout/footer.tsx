import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <h3 className="gold-text mb-4 text-xl font-bold">CUSTOM GOLD GRILLZ</h3>
            <p className="mb-4 text-gray-400">
              Premium custom gold grillz and jewelry handcrafted with the finest materials for a perfect fit and
              luxurious look.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/grillz" className="text-gray-400 hover:text-white">
                  Shop Grillz
                </Link>
              </li>
              <li>
                <Link href="/products/jewelry" className="text-gray-400 hover:text-white">
                  Shop Jewelry
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-white">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/ambassador-program" className="text-gray-400 hover:text-white">
                  Ambassador Program
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping-delivery" className="text-gray-400 hover:text-white">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns-exchanges" className="text-gray-400 hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="text-gray-400 hover:text-white">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Stay Updated</h3>
            <p className="mb-4 text-gray-400">Subscribe to our newsletter for exclusive offers and updates.</p>
            <form className="space-y-2">
              <Input type="email" placeholder="Your email address" className="bg-gray-800 text-white" required />
              <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Custom Gold Grillz. All rights reserved.</p>
          <p className="mt-2 text-sm text-gray-500">
            All prices are in USD. Shipping and taxes calculated at checkout.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <img src="/placeholder.svg?height=30&width=50" alt="Visa" className="h-8" width={50} height={30} />
            <img src="/placeholder.svg?height=30&width=50" alt="Mastercard" className="h-8" width={50} height={30} />
            <img
              src="/placeholder.svg?height=30&width=50"
              alt="American Express"
              className="h-8"
              width={50}
              height={30}
            />
            <img src="/placeholder.svg?height=30&width=50" alt="PayPal" className="h-8" width={50} height={30} />
          </div>
        </div>
      </div>
    </footer>
  )
}

