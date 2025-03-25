import { Database } from './supabase';
import { Product } from './product';

export interface SearchParams {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: Database['public']['Enums']['grillz_material'];
  style?: Database['public']['Enums']['grillz_style'];
  inStock?: boolean;
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  totalCount: number;
}

export interface SearchHistory {
  id: string;
  user_id: string;
  query: string;
  created_at: string;
}

export interface PopularSearch {
  query: string;
  search_count: number;
  last_searched_at: string;
}

export interface AutocompleteResult {
  id: string;
  term: string;
  count: number;
  category?: string;
}
