"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { 
  Plus, Search, Filter, ArrowUpDown, MoreHorizontal, Edit, Trash, Eye, 
  Download, Upload, Loader2
} from "lucide-react"
import Link from 'next/link'
import { ProductRepository } from '@/lib/repositories/product-repository'
import { ProductStatus } from '@/types/product'
import { Button } from '@/components/ui/button'
import ProductsTable from '@/components/admin/products/products-table'
import ProductsTableSkeleton from '@/components/admin/products/products-table-skeleton'
import ProductsFilter from '@/components/admin/products/products-filter'
import { PlusIcon } from 'lucide-react'

interface Product {
  id: string
  name: string
  price: number
  category: string
  inventory: number
  featured: boolean
  published: boolean
  createdAt: string
  updatedAt: string
}

export const metadata = {
  title: 'Product Management - Veliano Admin',
  description: 'Manage your jewelry products'
}

export default async function AdminProductsPage({
  searchParams
}: {
  searchParams: {
    status?: ProductStatus
    featured?: string
    is_new?: string
    page?: string
  }
}) {
  const status = searchParams.status || 'active'
  const featured = searchParams.featured === 'true'
  const is_new = searchParams.is_new === 'true'
  const page = Number(searchParams.page || '1')
  const limit = 10
  const offset = (page - 1) * limit

  async function ProductsContent() {
    // Convert query params to appropriate types
    const result = await ProductRepository.getProducts({
      status: status as ProductStatus,
      featured: searchParams.featured ? featured : undefined,
      is_new: searchParams.is_new ? is_new : undefined,
      limit,
      offset
    })

    return (
      <ProductsTable 
        products={result.products} 
        total={result.total} 
        currentPage={page}
        pageSize={limit}
      />
    )
  }

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-500">Manage your jewelry products and inventory</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            New Product
          </Link>
        </Button>
      </div>

      <ProductsFilter currentStatus={status} featured={featured} isNew={is_new} />

      <div className="bg-white shadow rounded-lg">
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsContent />
        </Suspense>
      </div>
    </div>
  )
}
