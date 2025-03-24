import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { type User } from '@/types/user';

/**
 * Get the current authenticated user
 * @returns The current user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return null;
  }
  
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
  
  if (userError || !user) {
    return null;
  }
  
  return {
    id: user.id,
    email: session.user.email || '',
    name: user.full_name || '',
    avatarUrl: user.avatar_url || '',
    role: user.role || 'customer',
    ...user
  };
}

/**
 * Check if the current user has a specific role
 * @param role The role to check
 * @returns True if the user has the specified role
 */
export async function hasRole(role: string): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if the current user is authenticated
 * @returns True if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Check if the current user is an admin
 * @returns True if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

/**
 * Get the current user's ID
 * @returns The current user's ID or null if not authenticated
 */
export async function getCurrentUserId(): Promise<string | null> {
  const user = await getCurrentUser();
  return user?.id || null;
} 