import { Metadata } from "next"
import { CustomOrderDetailClient } from "@/components/admin/custom-orders/custom-order-detail-client"

export const metadata: Metadata = {
  title: "Custom Order Details | Admin",
  description: "View and manage custom order details",
}

export default function CustomOrderDetailPage({ params }: { params: { id: string } }) {
  return <CustomOrderDetailClient id={params.id} />
}