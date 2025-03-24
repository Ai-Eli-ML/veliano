
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
