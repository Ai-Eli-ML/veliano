'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/types/user';
import { useAuth } from '@/hooks/useAuth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Heart, 
  Mail,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { useTheme } from '../providers/theme-provider';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { setTheme, theme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80%] sm:w-[385px]">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center space-x-2 text-sm font-medium"
                >
                  <span className="font-bold">VELIANO</span>
                </Link>
                <Link href="/products" className="transition-colors hover:text-foreground/80">
                  Products
                </Link>
                <Link href="/wishlist" className="transition-colors hover:text-foreground/80">
                  Wishlist
                </Link>
                <Link href="/search" className="transition-colors hover:text-foreground/80">
                  Search
                </Link>
                <Link href="/account" className="transition-colors hover:text-foreground/80">
                  Account
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="hidden md:block">
            <div className="flex items-center space-x-2 text-2xl font-bold">
              VELIANO
            </div>
          </Link>
          <nav className="mx-6 hidden items-center space-x-4 md:flex lg:space-x-6">
            <Link
              href="/products"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Products
            </Link>
            <Link
              href="/wishlist"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Wishlist
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Search
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/search" passHref>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          </Link>
          <Link href="/cart" passHref>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          <Link href="/account" passHref>
            <Button variant="ghost" size="icon">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden md:flex"
          >
            <span className="sr-only">Toggle theme</span>
            {theme === "dark" ? (
              <span className="h-5 w-5">🌙</span>
            ) : (
              <span className="h-5 w-5">☀️</span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
} 