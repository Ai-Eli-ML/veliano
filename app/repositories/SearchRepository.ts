import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { 
  type SearchHistory, 
  type PopularSearch,
  type SearchResult,
  type SearchParams,
  type AutocompleteResult
} from '@/types/search';
import { type Product } from '@/types/product';

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  style?: string;
  inStock?: boolean;
}

export class SearchRepository {
  private supabase = createClientComponentClient<Database>();
  private readonly AUTOCOMPLETE_LIMIT = 5;
  private readonly SEARCH_RESULTS_LIMIT = 20;
  private readonly defaultLimit = 12;

  /**
   * Search products with full-text search and filters
   */
  async searchProducts(params: SearchParams): Promise<SearchResult> {
    const {
      query,
      categoryId,
      minPrice,
      maxPrice,
      material,
      style,
      inStock,
      sortBy = 'relevance',
      page = 1,
      limit = this.defaultLimit,
    } = params;

    let queryBuilder = this.supabase
      .rpc('search_products', {
        search_query: query || '',
        category_id: categoryId || null,
        min_price: minPrice || 0,
        max_price: maxPrice || null,
        material_filter: material || null,
        style_filter: style || null,
        in_stock_only: inStock || false,
      })
      .select('*');

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        queryBuilder = queryBuilder.order('price', { ascending: true });
        break;
      case 'price_desc':
        queryBuilder = queryBuilder.order('price', { ascending: false });
        break;
      case 'newest':
        queryBuilder = queryBuilder.order('created_at', { ascending: false });
        break;
      default:
        // For 'relevance', the ordering is handled by the search_products function
        break;
    }

    // Apply pagination
    const start = (page - 1) * limit;
    queryBuilder = queryBuilder.range(start, start + limit - 1);

    const { data: products, error, count } = await queryBuilder;

    if (error) {
      console.error('Error searching products:', error);
      throw error;
    }

    // Log search for analytics
    await this.logSearch({
      query: query || '',
      filters: {
        categoryId,
        minPrice,
        maxPrice,
        material,
        style,
        inStock,
      },
      sortBy,
      resultsCount: count || 0,
    });

    return {
      products: products as Product[],
      totalCount: count || 0,
    };
  }

  /**
   * Log a search query
   */
  async logSearch(params: {
    query: string;
    filters: {
      categoryId?: string;
      minPrice?: number;
      maxPrice?: number;
      material?: Database['public']['Enums']['grillz_material'];
      style?: Database['public']['Enums']['grillz_style'];
      inStock?: boolean;
    };
    sortBy?: SearchParams['sortBy'];
    resultsCount: number;
  }) {
    const { data: session } = await this.supabase.auth.getSession();
    const userId = session?.session?.user?.id;

    const { error } = await this.supabase.from('search_logs').insert({
      user_id: userId,
      query: params.query,
      filters: params.filters,
      sort_by: params.sortBy,
      results_count: params.resultsCount,
    });

    if (error) {
      console.error('Error logging search:', error);
    }
  }

  /**
   * Performs a full-text search with filtering and sorting
   */
  async search(
    query: string,
    filters?: SearchFilters,
    page: number = 1,
    sortBy: 'relevance' | 'price_asc' | 'price_desc' = 'relevance'
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      let searchQuery = this.supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          price,
          slug,
          category_id,
          is_available,
          inventory_quantity,
          categories!inner(name)
        `, { count: 'exact' })
        .textSearch('name', query, { type: 'websearch' })
        .order('name', { ascending: true });

      // Apply filters
      if (filters) {
        if (filters.category) {
          searchQuery = searchQuery.eq('category_id', filters.category);
        }
        if (filters.minPrice !== undefined) {
          searchQuery = searchQuery.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          searchQuery = searchQuery.lte('price', filters.maxPrice);
        }
        if (filters.material) {
          searchQuery = searchQuery.eq('material', filters.material);
        }
        if (filters.style) {
          searchQuery = searchQuery.eq('style', filters.style);
        }
        if (filters.inStock) {
          searchQuery = searchQuery.gt('inventory_quantity', 0);
        }
      }

      // Apply sorting
      if (sortBy === 'price_asc') {
        searchQuery = searchQuery.order('price', { ascending: true });
      } else if (sortBy === 'price_desc') {
        searchQuery = searchQuery.order('price', { ascending: false });
      }

      // Apply pagination
      const offset = (page - 1) * this.SEARCH_RESULTS_LIMIT;
      searchQuery = searchQuery
        .range(offset, offset + this.SEARCH_RESULTS_LIMIT - 1);

      const { data: results, count, error } = await searchQuery;

      if (error) {
        console.error('Error performing search:', error);
        throw new Error('Failed to perform search');
      }

      // Track search query
      await this.trackSearchQuery(query, results?.length || 0);

      return {
        results: results?.map(result => ({
          ...result,
          score: this.calculateRelevanceScore(query, result)
        })) || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in search:', error);
      throw new Error('Failed to perform search');
    }
  }

  /**
   * Gets autocomplete suggestions based on partial input
   */
  async getAutocompleteSuggestions(
    partial: string
  ): Promise<AutocompleteResult[]> {
    if (!partial || partial.length < 2) {
      return [];
    }

    try {
      const { data: results, error } = await this.supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          categories(name)
        `)
        .ilike('name', `${partial}%`)
        .limit(this.AUTOCOMPLETE_LIMIT);

      if (error) {
        console.error('Error getting autocomplete suggestions:', error);
        throw new Error('Failed to get suggestions');
      }

      return results.map(result => ({
        id: result.id,
        name: result.name,
        slug: result.slug,
        category: result.categories?.name || null,
        price: result.price
      }));
    } catch (error) {
      console.error('Error in autocomplete:', error);
      throw new Error('Failed to get suggestions');
    }
  }

  /**
   * Tracks search queries for analytics
   */
  private async trackSearchQuery(
    query: string,
    resultCount: number
  ): Promise<void> {
    try {
      await this.supabase
        .from('search_logs')
        .insert({
          query,
          result_count: resultCount,
          session_id: uuidv4(),
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error tracking search query:', error);
    }
  }

  /**
   * Calculates relevance score for search results
   */
  private calculateRelevanceScore(query: string, result: any): number {
    const nameMatch = result.name.toLowerCase().includes(query.toLowerCase());
    const descriptionMatch = result.description?.toLowerCase().includes(query.toLowerCase());
    
    let score = 0;
    if (nameMatch) score += 10;
    if (descriptionMatch) score += 5;
    
    return score;
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
