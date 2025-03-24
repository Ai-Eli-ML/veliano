
'use client';

import { type FC } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Pagination } from '@/components/ui/pagination';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/actions/search';
import { type SearchParams } from '@/types/search';
import { Product } from '@/types/product';

interface SearchResultsProps {
  initialResults: {
    products: Product[];
    totalCount: number;
  };
  initialSearchParams: SearchParams;
}

export const SearchResults: FC<SearchResultsProps> = ({
  initialResults,
  initialSearchParams
}) => {
  const searchParams = useSearchParams();
  
  // Get current search parameters
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '12');
  const categoryId = searchParams.get('category') || undefined;
  const minPrice = searchParams.get('min') ? parseInt(searchParams.get('min')!) : undefined;
  const maxPrice = searchParams.get('max') ? parseInt(searchParams.get('max')!) : undefined;
  const sortBy = (searchParams.get('sort') as SearchParams['sortBy']) || 'relevance';
  
  // Prepare search params object
  const params: SearchParams = {
    query,
    page,
    limit,
    categoryId,
    minPrice,
    maxPrice,
    sortBy
  };
  
  // Fetch search results
  const { data, isLoading, error } = useQuery({
    queryKey: ['searchResults', params],
    queryFn: async () => {
      const result = await searchProducts(params);
      return result.success ? result.data : { products: [], totalCount: 0 };
    },
    initialData: initialResults,
    // Only refetch if the search params have changed from initial
    enabled: JSON.stringify(params) !== JSON.stringify(initialSearchParams)
  });
  
  // Calculate pagination
  const totalPages = Math.ceil((data?.totalCount || 0) / limit);
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-md" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">Error loading search results</h3>
        <p className="text-gray-500">Please try again later</p>
      </div>
    );
  }
  
  const products = data?.products || [];
  const totalCount = data?.totalCount || 0;
  
  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No results found</h3>
        <p className="text-gray-500">Try adjusting your search or filters</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalCount)} of {totalCount} results
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => {
            // Update URL with new page
            const url = new URL(window.location.href);
            url.searchParams.set('page', newPage.toString());
            window.history.pushState({}, '', url.toString());
            
            // Let the query refetch with new params
          }}
        />
      )}
    </div>
  );
};
