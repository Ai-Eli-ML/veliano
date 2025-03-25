'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchFilters } from './SearchFilters';
import { SearchSort } from './SearchSort';
import { SearchInput } from './SearchInput';
import { SearchRepository } from '@/repositories/SearchRepository';
import { Database } from '@/types/supabase';
import { Product } from '@/types/product';
import { ProductCard } from '@/components/products/ProductCard';
import { Pagination } from '@/components/ui/pagination';

type Category = Database['public']['Tables']['categories']['Row'];
type GrillzMaterial = Database['public']['Enums']['grillz_material'];
type GrillzStyle = Database['public']['Enums']['grillz_style'];
type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

interface SearchContainerProps {
  categories: Category[];
  initialProducts?: Product[];
  initialTotalCount?: number;
}

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: GrillzMaterial;
  style?: GrillzStyle;
  inStock?: boolean;
}

export function SearchContainer({
  categories,
  initialProducts = [],
  initialTotalCount = 0,
}: SearchContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRepository = new SearchRepository();

  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState<SearchFilters>({
    category: searchParams?.get('category') || undefined,
    minPrice: Number(searchParams?.get('minPrice')) || undefined,
    maxPrice: Number(searchParams?.get('maxPrice')) || undefined,
    material: (searchParams?.get('material') as GrillzMaterial) || undefined,
    style: (searchParams?.get('style') as GrillzStyle) || undefined,
    inStock: searchParams?.get('inStock') === 'true',
  });

  const [sort, setSort] = useState<SortOption>(
    (searchParams?.get('sort') as SortOption) || 'relevance'
  );

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await searchRepository.searchProducts({
        query,
        categoryId: filters.category,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        material: filters.material,
        style: filters.style,
        inStock: filters.inStock,
        sortBy: sort,
        page,
      });

      setProducts(result.products);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('Error performing search:', error);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters, sort, page, searchRepository]);

  useEffect(() => {
    if (query || Object.values(filters).some(Boolean) || sort !== 'relevance') {
      performSearch();
    }
  }, [query, filters, sort, page, performSearch]);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPage(1);

    const params = new URLSearchParams(searchParams?.toString() || '');
    if (newQuery) {
      params.set('q', newQuery);
    } else {
      params.delete('q');
    }
    params.delete('page');
    router.push('?' + params.toString());
  }, [router, searchParams]);

  const handleFilterChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleSortChange = useCallback((newSort: SortOption) => {
    setSort(newSort);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams?.toString() || '');
    params.set('page', newPage.toString());
    router.push('?' + params.toString());
  }, [router, searchParams]);

  return (
    <div className="grid grid-cols-4 gap-6">
      <aside className="col-span-1">
        <SearchFilters
          categories={categories}
          minPrice={0}
          maxPrice={5000}
          initialFilters={filters}
          onFilterChange={handleFilterChange}
        />
      </aside>

      <main className="col-span-3">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SearchInput
              initialValue={query}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
            <SearchSort
              initialSort={sort}
              onSortChange={handleSortChange}
            />
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : products.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              {totalCount > products.length && (
                <Pagination
                  currentPage={page}
                  totalPages={Math.ceil(totalCount / 12)}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                No products found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 