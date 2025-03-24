
import { Database } from '@/types/supabase';

export interface Review extends Database['public']['Tables']['reviews']['Row'] {
  // Base type from Supabase schema
}

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  title?: string;
  content?: string;
}

export interface UpdateReviewInput {
  rating?: number;
  title?: string;
  content?: string;
}

export interface ReviewWithUser extends Review {
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface ProductRatingStats {
  average_rating: number;
  total_reviews: number;
  rating_distribution: {
    [key: number]: number; // key: rating (1-5), value: count
  };
}
