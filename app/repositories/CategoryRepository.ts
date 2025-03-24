import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { type Database } from '@/types/supabase';

export type Category = Database['public']['Tables']['categories']['Row'];

export class CategoryRepository {
  async getCategories() {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error fetching categories:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred while fetching categories' 
      };
    }
  }
  
  async getCategoryById(id: string) {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error(`Error fetching category ${id}:`, error);
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error(`Unexpected error fetching category ${id}:`, error);
      return { 
        success: false, 
        error: 'An unexpected error occurred while fetching the category' 
      };
    }
  }
  
  async getCategoriesWithProductCount() {
    try {
      const cookieStore = cookies();
      const supabase = createClient(cookieStore);
      
      // First get all categories
      const { data: categories, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
        return { success: false, error: categoriesError.message };
      }
      
      // For each category, count the products
      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);
          
          return {
            ...category,
            product_count: countError ? 0 : count || 0
          };
        })
      );
      
      return { success: true, data: categoriesWithCount };
    } catch (error) {
      console.error('Unexpected error fetching categories with count:', error);
      return { 
        success: false, 
        error: 'An unexpected error occurred while fetching categories' 
      };
    }
  }
} 