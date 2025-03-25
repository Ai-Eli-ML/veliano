import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

type TestVariant = 'collaborative' | 'content_based' | 'popularity' | 'hybrid';

interface ABTestAssignment {
  user_id?: string;
  session_id: string;
  variant: TestVariant;
  test_id: string;
}

interface ABTestResult {
  test_id: string;
  variant: TestVariant;
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
}

export class RecommendationABTestRepository {
  private supabase = createClientComponentClient<Database>();
  private readonly TEST_ID = 'recommendation_strategy_test';
  private readonly VARIANTS: TestVariant[] = ['collaborative', 'content_based', 'popularity', 'hybrid'];

  /**
   * Assigns a user/session to a test variant using consistent hashing
   */
  async assignToVariant(userId?: string, sessionId?: string): Promise<TestVariant> {
    // If we have neither user ID nor session ID, generate a random session ID
    const id = userId || sessionId || uuidv4();
    
    // Use the last character of the UUID for consistent assignment
    const lastChar = id.slice(-1);
    const variantIndex = parseInt(lastChar, 16) % this.VARIANTS.length;
    const variant = this.VARIANTS[variantIndex];

    try {
      await this.supabase
        .from('ab_test_assignments')
        .insert({
          test_id: this.TEST_ID,
          user_id: userId,
          session_id: sessionId || id,
          variant,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error assigning to variant:', error);
    }

    return variant;
  }

  /**
   * Gets the variant assignment for a user/session
   */
  async getVariant(userId?: string, sessionId?: string): Promise<TestVariant> {
    if (!userId && !sessionId) {
      return this.assignToVariant();
    }

    try {
      const { data } = await this.supabase
        .from('ab_test_assignments')
        .select('variant')
        .eq('test_id', this.TEST_ID)
        .or(`user_id.eq.${userId},session_id.eq.${sessionId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data?.variant) {
        return data.variant as TestVariant;
      }
    } catch (error) {
      console.error('Error getting variant:', error);
    }

    return this.assignToVariant(userId, sessionId);
  }

  /**
   * Tracks a conversion event for the test
   */
  async trackConversion(event: {
    user_id?: string;
    session_id: string;
    variant: TestVariant;
    revenue: number;
  }): Promise<void> {
    try {
      await this.supabase
        .from('ab_test_conversions')
        .insert({
          test_id: this.TEST_ID,
          user_id: event.user_id,
          session_id: event.session_id,
          variant: event.variant,
          revenue: event.revenue,
          created_at: new Date().toISOString(),
        });
    } catch (error) {
      console.error('Error tracking conversion:', error);
    }
  }

  /**
   * Gets test results aggregated by variant
   */
  async getTestResults(): Promise<ABTestResult[]> {
    try {
      const { data } = await this.supabase
        .rpc('get_ab_test_results', {
          test_id: this.TEST_ID
        });

      return data || [];
    } catch (error) {
      console.error('Error getting test results:', error);
      return [];
    }
  }
} 