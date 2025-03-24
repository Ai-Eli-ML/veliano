
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
