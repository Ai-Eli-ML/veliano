'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useTransition } from 'react';
import { ProductStatus } from '@/types/product';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductsFilterProps {
  currentStatus: ProductStatus;
  featured: boolean;
  isNew: boolean;
}

export default function ProductsFilter({ 
  currentStatus,
  featured,
  isNew
}: ProductsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(window.location.search);
      
      if (value === null) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      
      // Reset page when filter changes
      if (name !== 'page') {
        params.delete('page');
      }
      
      return params.toString();
    },
    []
  );

  const handleStatusChange = (value: string) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString('status', value)}`,
        { scroll: false }
      );
    });
  };

  const handleFeaturedChange = (checked: boolean) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString('featured', checked ? 'true' : null)}`,
        { scroll: false }
      );
    });
  };

  const handleIsNewChange = (checked: boolean) => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString('is_new', checked ? 'true' : null)}`,
        { scroll: false }
      );
    });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-lg shadow">
      <div>
        <h2 className="text-sm font-medium mb-2">Status</h2>
        <Tabs value={currentStatus} onValueChange={handleStatusChange} className="w-full">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="flex items-center space-x-6 ml-auto">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="featured" 
            checked={featured}
            onCheckedChange={handleFeaturedChange}
          />
          <Label htmlFor="featured">Featured</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="is_new" 
            checked={isNew}
            onCheckedChange={handleIsNewChange}
          />
          <Label htmlFor="is_new">New Products</Label>
        </div>
      </div>
    </div>
  );
} 