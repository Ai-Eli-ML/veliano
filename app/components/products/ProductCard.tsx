'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-colors hover:bg-accent"
    >
      <div className="aspect-square overflow-hidden rounded-md">
        <Image
          src={product.images[0]?.url || '/images/placeholder.png'}
          alt={product.name}
          width={300}
          height={300}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-sm font-medium text-primary">
            {formatPrice(product.price)}
          </p>
          {!product.is_available && (
            <span className="text-xs text-muted-foreground">Out of stock</span>
          )}
        </div>
      </div>
    </Link>
  );
} 