"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  BarChart3, 
  Gift, 
  Grid, 
  LayoutDashboard, 
  Package, 
  Settings, 
  ShoppingCart, 
  Users 
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

interface AdminNavProps {
  className?: string
}

export function AdminNav({ className }: AdminNavProps) {
  const pathname = usePathname()
  
  const navItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Products",
      href: "/admin/products",
      icon: <Package className="mr-2 h-4 w-4" />,
    },
    {
      title: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="mr-2 h-4 w-4" />,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: <Users className="mr-2 h-4 w-4" />,
    },
    {
      title: "Custom Orders",
      href: "/admin/custom-orders",
      icon: <Gift className="mr-2 h-4 w-4" />,
    },
    {
      title: "Affiliates",
      href: "/admin/affiliates",
      icon: <BarChart3 className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
    {
      title: "Help",
      href: "/admin/help",
      icon: <Grid className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className={cn("flex flex-col space-y-1", className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href || pathname?.startsWith(`${item.href}/`)
              ? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            "justify-start"
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
} 