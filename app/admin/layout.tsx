"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  DollarSign,
  Package,
  Settings,
  Users,
  ShoppingCart,
  LogOut,
  UserPlus,
  LineChart,
  LayoutDashboard,
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Toaster } from "@/components/ui/sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active: boolean
}

const NavItem = ({ href, icon, label, active }: NavItemProps) => (
  <Button
    asChild
    variant="ghost"
    className={cn(
      "w-full justify-start gap-2",
      active && "bg-muted"
    )}
  >
    <Link href={href}>
      {icon}
      {label}
    </Link>
  </Button>
)

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  
  // Mock admin user data - would come from Supabase auth in a real implementation
  const adminUser = {
    name: "Admin User",
    email: "admin@veliano.com",
    role: "Admin",
    avatar: "/images/admin-avatar.png"
  }

  // Auth check simulation
  useEffect(() => {
    // This would be replaced with an actual authentication check
    // For example: checking session and admin role from Supabase
    const checkAuth = () => {
      // Simulate auth check with a timeout
      setTimeout(() => {
        // In a real app, you would check if user has admin access here
        // and redirect to login if not authenticated
        const isAdmin = true // Mock value - replace with real auth check
        
        if (!isAdmin) {
          router.push('/account/login?redirect=/admin')
          return
        }
        
        setAuthorized(true)
        setLoading(false)
      }, 500)
    }
    
    checkAuth()
  }, [router])

  // Admin navigation items
  const navItems = [
    { href: "/admin", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/admin/products", icon: <Package size={20} />, label: "Products" },
    { href: "/admin/orders", icon: <ShoppingCart size={20} />, label: "Orders" },
    { href: "/admin/customers", icon: <Users size={20} />, label: "Customers" },
    { href: "/admin/custom-orders", icon: <Sparkles size={20} />, label: "Custom Orders" },
    { href: "/admin/content", icon: <FileText size={20} />, label: "Content" },
    { href: "/admin/analytics", icon: <LineChart size={20} />, label: "Analytics" },
    { href: "/admin/affiliates", icon: <UserPlus size={20} />, label: "Affiliates" },
    { href: "/admin/settings", icon: <Settings size={20} />, label: "Settings" },
  ]

  if (loading) {
    return <AdminLoadingState />
  }

  if (!authorized) {
    return null // Nothing to render as user will be redirected
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
            >
              <ArrowLeft size={16} />
              Back to Website
            </Link>
          </div>
          <nav className="flex-1 overflow-auto p-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
                <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium leading-none">{adminUser.name}</p>
                <p className="text-xs text-muted-foreground truncate">{adminUser.email}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon"
                aria-label="Log out"
                onClick={() => {
                  // In real app: Sign out from Supabase auth
                  router.push('/account/login')
                }}
              >
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Nav */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          {/* Mobile nav trigger */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Package className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden">
              <div className="flex h-full flex-col">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setMobileNavOpen(false)}
                >
                  <ArrowLeft size={16} />
                  Back to Website
                </Link>
                <nav className="flex-1 overflow-auto py-6">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className="w-full justify-start mb-1"
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Link href={item.href}>
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex-1">
            <h1 className="text-xl font-semibold lg:hidden">Admin Portal</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/help">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Link>
            </Button>
            <Avatar className="h-8 w-8 lg:hidden">
              <AvatarImage src={adminUser.avatar} alt={adminUser.name} />
              <AvatarFallback>{adminUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          <Toaster position="top-right" />
          {children}
        </main>
      </div>
    </div>
  )
}

function AdminLoadingState() {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 border-r bg-card lg:block">
        <div className="flex h-14 items-center border-b px-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-2 space-y-2">
          {Array(8).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="h-14 border-b px-4 flex items-center">
          <Skeleton className="h-8 w-8 lg:hidden" />
          <div className="flex-1" />
          <Skeleton className="h-8 w-20" />
        </header>
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {Array(3).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-48 mt-8 mb-4" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}
