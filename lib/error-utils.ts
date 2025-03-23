import { PostgrestError } from '@supabase/supabase-js';

/**
 * Handle Supabase error by logging it and optionally rethrowing
 * or returning a default value
 */
export function handleSupabaseError(
  error: Error | PostgrestError,
  message?: string,
  rethrow: boolean = false
): void {
  if ('code' in error && 'message' in error && 'details' in error) {
    // This is a PostgrestError
    console.error(
      `Supabase error ${message ? `(${message})` : ''}: 
      Code: ${error.code}
      Message: ${error.message}
      Details: ${error.details}`,
      error
    );
  } else {
    // This is a general Error
    console.error(
      `Error ${message ? `(${message})` : ''}:`,
      error
    );
  }

  if (rethrow) {
    throw error;
  }
} 