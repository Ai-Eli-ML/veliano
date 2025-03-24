import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="font-bold text-xl md:text-2xl">
              VELIANO
            </Link>
            <p className="mt-2 text-sm text-muted-foreground md:mt-4">
              Luxury jewelry and custom grillz for those who appreciate the finer things in life.
            </p>
            <div className="mt-4 flex space-x-3">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Shop</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/products" className="text-sm text-muted-foreground hover:text-foreground">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
                  Search Products
                </Link>
              </li>
              <li>
                <Link href="/products/new" className="text-sm text-muted-foreground hover:text-foreground">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/products/featured" className="text-sm text-muted-foreground hover:text-foreground">
                  Featured Items
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Account</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/account" className="text-sm text-muted-foreground hover:text-foreground">
                  My Account
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-sm text-muted-foreground hover:text-foreground">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-foreground">
                  Order History
                </Link>
              </li>
              <li>
                <Link href="/account/email-preferences" className="text-sm text-muted-foreground hover:text-foreground">
                  Email Preferences
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Connect</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/email/subscribe" className="text-sm text-muted-foreground hover:text-foreground">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Veliano Jewelry. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="/shipping" className="text-xs text-muted-foreground hover:text-foreground">
                Shipping Info
              </Link>
              <Link href="/returns" className="text-xs text-muted-foreground hover:text-foreground">
                Returns & Refunds
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 