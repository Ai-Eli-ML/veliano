'use server';

import { SearchRepository } from '@/repositories/SearchRepository';
import { 
  type SearchParams,
  type SearchResult,
  type AutocompleteResult
} from '@/types/search';
import { getCurrentUser } from '@/lib/session';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { z } from 'zod';

const searchRepository = new SearchRepository();

// Define the search parameters schema
const searchParamsSchema = z.object({
  query: z.string().optional(),
  page: z.number().positive().optional().default(1),
  limit: z.number().positive().optional().default(12),
  categoryId: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  sortBy: z.enum(['relevance', 'price_asc', 'price_desc', 'newest', 'rating']).optional().default('relevance'),
});

// Type for search parameters
export type SearchParams = z.infer<typeof searchParamsSchema>;

/**
 * Search for products based on the provided parameters
 */
export async function searchProducts(params: SearchParams) {
  try {
    // Validate search parameters
    const validatedParams = searchParamsSchema.parse(params);
    
    // Get cookie store and create Supabase client
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Set up the base query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id(id, name),
        images:product_images(id, url, alt, position)
      `, { count: 'exact' });
    
    // Apply filters
    
    // Text search if query is provided
    if (validatedParams.query && validatedParams.query.trim() !== '') {
      query = query.textSearch('name', validatedParams.query, {
        type: 'websearch',
        config: 'english'
      });
    }
    
    // Category filter
    if (validatedParams.categoryId) {
      query = query.eq('category_id', validatedParams.categoryId);
    }
    
    // Price range filters
    if (validatedParams.minPrice !== undefined) {
      query = query.gte('price', validatedParams.minPrice);
    }
    
    if (validatedParams.maxPrice !== undefined) {
      query = query.lte('price', validatedParams.maxPrice);
    }
    
    // Apply sorting
    switch (validatedParams.sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'relevance':
      default:
        // For relevance, we rely on the text search ranking
        if (!validatedParams.query || validatedParams.query.trim() === '') {
          // If no query, default to newest
          query = query.order('created_at', { ascending: false });
        }
        break;
    }
    
    // Calculate pagination
    const page = validatedParams.page || 1;
    const limit = validatedParams.limit || 12;
    const offset = (page - 1) * limit;
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('Error searching products:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
    
    // Return the search results
    return { 
      success: true, 
      data: {
        products: data,
        totalCount: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    };
  } catch (error) {
    console.error('Unexpected error during product search:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
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
