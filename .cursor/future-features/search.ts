/**
 * Enhanced Search System with Autocomplete Template
 * For Phase 4 of Veliano E-commerce Project
 */

/**
 * Database Schema Template
 */
export const databaseSchema = `
-- Search indices for products
CREATE INDEX IF NOT EXISTS idx_products_search ON products 
USING GIN (to_tsvector('english', name || ' ' || description));

-- Search history for tracking popular searches
CREATE TABLE IF NOT EXISTS search_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  search_query TEXT NOT NULL,
  result_count INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Popular search terms (updated periodically by a job)
CREATE TABLE IF NOT EXISTS popular_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_term TEXT UNIQUE NOT NULL,
  search_count INTEGER NOT NULL,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS and add policies
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE popular_searches ENABLE ROW LEVEL SECURITY;

-- Search history policies
CREATE POLICY "Users can insert their own search history"
  ON search_history FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  ));

-- Popular searches policies (readable by all)
CREATE POLICY "Anyone can view popular searches"
  ON popular_searches FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage popular searches"
  ON popular_searches FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

-- Full-text search function for products
CREATE OR REPLACE FUNCTION search_products(search_term TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  price DECIMAL,
  category_id UUID,
  image_url TEXT,
  stock_quantity INTEGER,
  is_featured BOOLEAN,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.description,
    p.price,
    p.category_id,
    p.image_url,
    p.stock_quantity,
    p.is_featured,
    ts_rank(to_tsvector('english', p.name || ' ' || p.description), to_tsquery('english', search_term)) AS rank
  FROM
    products p
  WHERE
    to_tsvector('english', p.name || ' ' || p.description) @@ to_tsquery('english', search_term)
  ORDER BY
    rank DESC;
END;
$$ LANGUAGE plpgsql;
`;

/**
 * TypeScript Types Template
 */
export const typesDefinition = `
import { Database } from '@/types/supabase';
import { Product } from '@/types/product';

export interface SearchHistory extends Database['public']['Tables']['search_history']['Row'] {
  // Base type from Supabase schema
}

export interface PopularSearch extends Database['public']['Tables']['popular_searches']['Row'] {
  // Base type from Supabase schema
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
}

export interface SearchFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'relevance';
}

export interface AutocompleteResult {
  term: string;
  count: number;
}

export interface SearchParams extends SearchFilters {
  query: string;
  page?: number;
  limit?: number;
}
`;

/**
 * Repository Template
 */
export const searchRepository = `
import { createClient } from '@/lib/supabase/server';
import { 
  type SearchHistory, 
  type PopularSearch,
  type SearchResult,
  type SearchParams,
  type AutocompleteResult
} from '@/types/search';
import { type Product } from '@/types/product';

export class SearchRepository {
  private supabase = createClient();

  /**
   * Search products with full-text search and filters
   */
  async searchProducts(params: SearchParams): Promise<SearchResult> {
    const {
      query,
      categoryId,
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      page = 1,
      limit = 12
    } = params;

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Prepare search query - replace spaces with '&' for tsquery
    const searchQuery = query
      .trim()
      .split(/\\s+/)
      .filter(Boolean)
      .map(term => term.replace(/[^a-zA-Z0-9]/g, '') + ':*')
      .join(' & ');

    if (!searchQuery) {
      return { products: [], totalCount: 0 };
    }

    // Start with the RPC call for full-text search
    let productsQuery = this.supabase
      .rpc('search_products', { search_term: searchQuery })
      .select('*');

    // Apply filters
    if (categoryId) {
      productsQuery = productsQuery.eq('category_id', categoryId);
    }

    if (minPrice !== undefined) {
      productsQuery = productsQuery.gte('price', minPrice);
    }

    if (maxPrice !== undefined) {
      productsQuery = productsQuery.lte('price', maxPrice);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        productsQuery = productsQuery.order('price', { ascending: true });
        break;
      case 'price_desc':
        productsQuery = productsQuery.order('price', { ascending: false });
        break;
      case 'newest':
        productsQuery = productsQuery.order('created_at', { ascending: false });
        break;
      case 'relevance':
      default:
        productsQuery = productsQuery.order('rank', { ascending: false });
        break;
    }

    // Get count before pagination
    const { count, error: countError } = await productsQuery.count();

    if (countError) throw countError;

    // Apply pagination
    productsQuery = productsQuery.range(from, to);

    // Execute query
    const { data: products, error } = await productsQuery;

    if (error) throw error;

    return {
      products: products as unknown as Product[],
      totalCount: count || 0
    };
  }

  /**
   * Log a search query
   */
  async logSearch(query: string, userId: string | null, resultCount: number): Promise<void> {
    await this.supabase
      .from('search_history')
      .insert({
        user_id: userId,
        search_query: query,
        result_count: resultCount
      });
  }

  /**
   * Get autocomplete suggestions based on previous searches
   */
  async getAutocompleteSuggestions(prefix: string, limit: number = 5): Promise<AutocompleteResult[]> {
    if (!prefix || prefix.length < 2) {
      return [];
    }

    // First try to get matches from popular searches
    const { data: popularData, error: popularError } = await this.supabase
      .from('popular_searches')
      .select('search_term, search_count')
      .ilike('search_term', \`\${prefix}%\`)
      .order('search_count', { ascending: false })
      .limit(limit);

    if (popularError) throw popularError;

    // If we have enough popular results, return them
    if (popularData.length >= limit) {
      return popularData.map(item => ({
        term: item.search_term,
        count: item.search_count
      }));
    }

    // Otherwise, supplement with recent search history
    const { data: historyData, error: historyError } = await this.supabase
      .from('search_history')
      .select('search_query')
      .ilike('search_query', \`\${prefix}%\`)
      .order('created_at', { ascending: false })
      .limit(limit - popularData.length);

    if (historyError) throw historyError;

    // Combine results, count duplicates, and return unique terms
    const combinedResults = [
      ...popularData.map(item => ({
        term: item.search_term,
        count: item.search_count
      })),
      ...historyData.map(item => ({
        term: item.search_query,
        count: 1
      }))
    ];

    // Deduplicate and aggregate counts
    const uniqueResults = combinedResults.reduce((acc, item) => {
      const existing = acc.find(x => x.term === item.term);
      if (existing) {
        existing.count += item.count;
      } else {
        acc.push(item);
      }
      return acc;
    }, [] as AutocompleteResult[]);

    // Sort by count and return top N
    return uniqueResults
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get popular searches
   */
  async getPopularSearches(limit: number = 10): Promise<PopularSearch[]> {
    const { data, error } = await this.supabase
      .from('popular_searches')
      .select('*')
      .order('search_count', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as PopularSearch[];
  }

  /**
   * Get user's recent searches
   */
  async getUserRecentSearches(userId: string, limit: number = 5): Promise<string[]> {
    const { data, error } = await this.supabase
      .from('search_history')
      .select('search_query')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    
    // Return unique search queries
    return [...new Set(data.map(item => item.search_query))];
  }
}
`;

/**
 * Server Actions Template
 */
export const serverActions = `
'use server';

import { SearchRepository } from '@/repositories/SearchRepository';
import { 
  type SearchParams,
  type SearchResult,
  type AutocompleteResult
} from '@/types/search';
import { getCurrentUser } from '@/lib/session';

const searchRepository = new SearchRepository();

/**
 * Search products with filters
 */
export async function searchProducts(params: SearchParams): Promise<{
  success: boolean;
  data?: SearchResult;
  error?: string;
}> {
  try {
    const searchResult = await searchRepository.searchProducts(params);
    
    // Log the search (async, don't wait for it)
    const currentUser = await getCurrentUser();
    searchRepository.logSearch(
      params.query, 
      currentUser?.id || null,
      searchResult.totalCount
    ).catch(err => {
      console.error('Failed to log search:', err);
    });
    
    return { 
      success: true, 
      data: searchResult 
    };
  } catch (error) {
    console.error('Search error:', error);
    return { 
      success: false, 
      error: 'Failed to perform search' 
    };
  }
}

/**
 * Get autocomplete suggestions
 */
export async function getAutocompleteSuggestions(
  prefix: string,
  limit: number = 5
): Promise<{
  success: boolean;
  data?: AutocompleteResult[];
  error?: string;
}> {
  try {
    if (!prefix || prefix.length < 2) {
      return { 
        success: true, 
        data: [] 
      };
    }
    
    const suggestions = await searchRepository.getAutocompleteSuggestions(prefix, limit);
    
    return { 
      success: true, 
      data: suggestions 
    };
  } catch (error) {
    console.error('Autocomplete error:', error);
    return { 
      success: false, 
      error: 'Failed to get suggestions' 
    };
  }
}

/**
 * Get recent searches for the current user
 */
export async function getRecentSearches(limit: number = 5): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return { 
        success: true, 
        data: [] 
      };
    }
    
    const recentSearches = await searchRepository.getUserRecentSearches(
      currentUser.id,
      limit
    );
    
    return { 
      success: true, 
      data: recentSearches 
    };
  } catch (error) {
    console.error('Recent searches error:', error);
    return { 
      success: false, 
      error: 'Failed to get recent searches' 
    };
  }
}

/**
 * Get popular searches
 */
export async function getPopularSearches(limit: number = 10): Promise<{
  success: boolean;
  data?: string[];
  error?: string;
}> {
  try {
    const popularSearches = await searchRepository.getPopularSearches(limit);
    
    return { 
      success: true, 
      data: popularSearches.map(item => item.search_term)
    };
  } catch (error) {
    console.error('Popular searches error:', error);
    return { 
      success: false, 
      error: 'Failed to get popular searches' 
    };
  }
}
`;

/**
 * Component Templates
 */

// SearchBar Component with Autocomplete
export const searchBarComponent = `
'use client';

import { type FC, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAutocompleteSuggestions } from '@/actions/search';
import { AutocompleteResult } from '@/types/search';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialQuery?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  placeholder = 'Search products...',
  initialQuery = ''
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Fetch autocomplete suggestions when the debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          const result = await getAutocompleteSuggestions(debouncedQuery);
          if (result.success && result.data) {
            setSuggestions(result.data);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);
  
  // Handle form submission
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    // Navigate to search page with query
    router.push('/search?q=' + encodeURIComponent(searchQuery.trim()));
    setShowAutocomplete(false);
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
    handleSearch(term);
    setSuggestions([]);
    setShowAutocomplete(false);
  };
  
  return (
    <div className={'relative w-full max-w-md ' + className}>
      <Popover open={showAutocomplete} onOpenChange={setShowAutocomplete}>
        <PopoverAnchor>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex w-full items-center"
          >
            <Input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowAutocomplete(e.target.value.length >= 2);
              }}
              onFocus={() => setShowAutocomplete(query.length >= 2)}
              className="w-full pr-10"
              ref={inputRef}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-1"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </PopoverAnchor>
        
        <PopoverContent
          className="p-0 w-[calc(100%-2rem)]"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelectSuggestion(suggestion.term)}
                      className="flex justify-between"
                    >
                      <span>{suggestion.term}</span>
                      <span className="text-muted-foreground text-xs">
                        {suggestion.count} results
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                query.length >= 2 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No suggestions found
                  </div>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
`;

// SearchFiltersComponent
export const searchFiltersComponent = `
'use client';

import { type FC, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { Category } from '@/types/category';

interface SearchFiltersProps {
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialCategoryId?: string;
  initialSortBy?: string;
  priceRange: {
    min: number;
    max: number;
  };
  categories: Category[];
}

export const SearchFilters: FC<SearchFiltersProps> = ({
  initialMinPrice,
  initialMaxPrice,
  initialCategoryId,
  initialSortBy = 'relevance',
  priceRange,
  categories
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceValues, setPriceValues] = useState<[number, number]>([
    initialMinPrice ?? priceRange.min,
    initialMaxPrice ?? priceRange.max
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategoryId
  );
  
  const [sortBy, setSortBy] = useState(initialSortBy);
  
  // Apply filters function
  const applyFilters = () => {
    // Get current search query
    const query = searchParams.get('q') || '';
    
    // Construct new URL with updated filters
    const url = new URL('/search', window.location.origin);
    url.searchParams.set('q', query);
    
    // Add filters
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    }
    
    // Only add price filters if they're different from the default range
    if (priceValues[0] > priceRange.min) {
      url.searchParams.set('min', priceValues[0].toString());
    }
    
    if (priceValues[1] < priceRange.max) {
      url.searchParams.set('max', priceValues[1].toString());
    }
    
    if (sortBy !== 'relevance') {
      url.searchParams.set('sort', sortBy);
    }
    
    // Navigate to the new URL
    router.push(url.pathname + url.search);
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceValues([priceRange.min, priceRange.max]);
    setSelectedCategory(undefined);
    setSortBy('relevance');
    
    // Get current search query
    const query = searchParams.get('q') || '';
    
    // Navigate to base search URL with only the query
    router.push('/search?q=' + encodeURIComponent(query));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-2">
          <h3 className="font-medium">Price Range</h3>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            value={priceValues}
            onValueChange={(value) => setPriceValues(value as [number, number])}
          />
          <div className="flex items-center justify-between text-sm">
            <span>${priceValues[0]}</span>
            <span>${priceValues[1]}</span>
          </div>
        </div>
        
        {/* Categories */}
        <div className="space-y-2">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategory === category.id}
                  onCheckedChange={(checked) => {
                    setSelectedCategory(checked ? category.id : undefined);
                  }}
                />
                <Label htmlFor={category.id}>{category.name}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sort By */}
        <div className="space-y-2">
          <h3 className="font-medium">Sort By</h3>
          <RadioGroup
            value={sortBy}
            onValueChange={setSortBy}
            className="space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relevance" id="relevance" />
              <Label htmlFor="relevance">Relevance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_asc" id="price_asc" />
              <Label htmlFor="price_asc">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_desc" id="price_desc" />
              <Label htmlFor="price_desc">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest First</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};
`;

// SearchResults component
export const searchResultsComponent = `
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
`; 