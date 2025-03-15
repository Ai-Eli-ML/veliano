"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getInitials } from "@/lib/utils"
import { useCart } from "@/hooks/use-cart"
import { useScroll } from "@/hooks/use-scroll"
import { useAuth } from "@/components/providers/auth-provider"
import { Menu, User, LogOut, Package, Settings, Heart, ShoppingCart } from "lucide-react"
import { CartSheet } from "@/components/cart/cart-sheet"
import { SearchButton } from "@/components/search/search-button"

const mainNavItems = [
  {
    title: "Grillz",
    href: "/products/grillz",
    children: [
      { title: "Single Tooth", href: "/products/grillz/single-tooth" },
      { title: "Bottom Grillz", href: "/products/grillz/bottom" },
      { title: "Top Grillz", href: "/products/grillz/top" },
      { title: "Full Sets", href: "/products/grillz/full-sets" },
      { title: "Custom Designs", href: "/products/grillz/custom" },
    ],
  },
  {
    title: "Jewelry",
    href: "/products/jewelry",
    children: [
      { title: "Chains", href: "/products/jewelry/chains" },
      { title: "Pendants", href: "/products/jewelry/pendants" },
      { title: "Bracelets", href: "/products/jewelry/bracelets" },
      { title: "Rings", href: "/products/jewelry/rings" },
      { title: "Earrings", href: "/products/jewelry/earrings" },
    ],
  },
  { title: "How It Works", href: "/how-it-works" },
  { title: "Ambassador Program", href: "/ambassador-program" },
  { title: "Contact", href: "/contact" },
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { isScrolled } = useScroll()
  const { user, signOut } = useAuth()

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white shadow-md dark:bg-gray-900" : "bg-transparent",
      )}
    >
      {/* Top Bar */}
      <div className="bg-black px-4 py-2 text-center text-sm text-white">
        <p>Free shipping on orders over $100 | Use code WELCOME10 for 10% off your first order</p>
      </div>

      <div className="container flex h-16 items-center justify-between px-4">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="gold-text text-2xl font-bold">CUSTOM GOLD GRILLZ</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavItems.map((item) =>
                item.children ? (
                  <NavigationMenuItem key={item.title}>
                    <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {item.children.map((child) => (
                          <li key={child.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{child.title}</div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.title}>
                    <Link href={item.href} legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>{item.title}</NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-1">
          {/* Search */}
          <SearchButton />

          {/* Account */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar_url || ""} alt={user.full_name || "User"} />
                    <AvatarFallback>{getInitials(user.full_name || "User")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <User className="mr-2 h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders">
                    <Package className="mr-2 h-4 w-4" /> Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/wishlist">
                    <Heart className="mr-2 h-4 w-4" /> Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-500">
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" asChild aria-label="Account">
              <Link href="/account/login">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Cart */}
          <CartSheet>
            <Button variant="ghost" size="icon" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {totalItems() > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {totalItems()}
                </span>
              )}
            </Button>
          </CartSheet>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] sm:w-[350px]">
          <nav className="flex flex-col gap-6">
            <Link href="/" className="gold-text text-2xl font-bold" onClick={() => setIsMobileMenuOpen(false)}>
              CUSTOM GOLD GRILLZ
            </Link>

            <div className="flex flex-col space-y-3">
              {mainNavItems.map((item) => (
                <div key={item.title} className="flex flex-col">
                  <Link
                    href={item.href}
                    className="text-lg font-medium"
                    onClick={() => !item.children && setIsMobileMenuOpen(false)}
                  >
                    {item.title}
                  </Link>

                  {item.children && (
                    <div className="ml-4 mt-2 flex flex-col space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href}
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || ""} alt={user.full_name || "User"} />
                      <AvatarFallback>{getInitials(user.full_name || "User")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.full_name || "User"}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/account"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="h-4 w-4" /> My Account
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Package className="h-4 w-4" /> My Orders
                  </Link>
                  <Link
                    href="/account/wishlist"
                    className="flex items-center gap-2 text-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Heart className="h-4 w-4" /> My Wishlist
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="flex items-center gap-2 text-sm text-red-500"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/account/login"
                  className="flex items-center gap-2 text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4" /> Login / Register
                </Link>
              )}
              <Link href="/cart" className="flex items-center gap-2 text-sm" onClick={() => setIsMobileMenuOpen(false)}>
                <ShoppingCart className="h-4 w-4" /> Cart ({totalItems()})
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}

