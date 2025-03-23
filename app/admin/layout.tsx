import { Metadata } from "next"
import { AdminHeader } from "@/components/admin/admin-header"
import { AdminNav } from "@/components/admin/admin-nav"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage products, orders, and customers in the Veliano admin dashboard",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <AdminHeader />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <AdminNav className="hidden md:block" />
        <main className="relative py-6">{children}</main>
      </div>
    </div>
  )
}
