
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
