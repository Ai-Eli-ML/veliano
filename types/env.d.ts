declare namespace NodeJS {
  interface ProcessEnv {
    // Supabase Environment Variables
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    
    // Other Environment Variables
    NEXT_PUBLIC_SITE_URL: string
    STRIPE_SECRET_KEY?: string
    STRIPE_WEBHOOK_SECRET?: string
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?: string
    
    // Node Environment
    NODE_ENV: 'development' | 'production' | 'test'
  }
} 