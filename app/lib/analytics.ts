import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type EventType = 
  | 'page_view'
  | 'product_view'
  | 'product_add_to_cart'
  | 'product_remove_from_cart'
  | 'checkout_started'
  | 'checkout_completed'
  | 'wishlist_add'
  | 'wishlist_remove'
  | 'search_performed'
  | 'search_result_clicked'
  | 'review_submitted'
  | 'email_subscribed'
  | 'email_preference_updated'
  | 'recommendation_clicked'
  | 'custom'

interface AnalyticsEvent {
  event_type: EventType
  user_id?: string
  session_id: string
  path: string
  referrer?: string
  properties?: Record<string, any>
  anonymized_ip?: string
  timestamp: string
}

const SESSION_ID_KEY = 'veliano_session_id'

const generateSessionId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return ''
  
  let sessionId = localStorage.getItem(SESSION_ID_KEY)
  
  if (!sessionId) {
    sessionId = generateSessionId()
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  
  return sessionId
}

const anonymizeIp = (ip: string): string => {
  // For IPv4, remove the last octet
  if (ip.includes('.')) {
    return ip.split('.').slice(0, 3).join('.') + '.0'
  }
  
  // For IPv6, remove the last 80 bits (last 5 segments)
  if (ip.includes(':')) {
    return ip.split(':').slice(0, 3).join(':') + ':0:0:0:0:0'
  }
  
  return ip
}

export const trackEvent = async (
  eventType: EventType,
  properties?: Record<string, any>,
  options?: {
    anonymize?: boolean
  }
) => {
  if (typeof window === 'undefined') return
  
  const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  const event: AnalyticsEvent = {
    event_type: eventType,
    user_id: session?.user?.id,
    session_id: getOrCreateSessionId(),
    path: window.location.pathname,
    referrer: document.referrer || undefined,
    properties,
    timestamp: new Date().toISOString(),
  }
  
  // If IP anonymization is requested, get IP and anonymize it
  if (options?.anonymize) {
    // In a real app, you'd need server-side code to get the IP
    // For this example, we'll use a placeholder
    event.anonymized_ip = anonymizeIp('127.0.0.1')
  }
  
  try {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics event:', event)
      return
    }
    
    // In production, insert to analytics_events table
    const { error } = await supabase
      .from('analytics_events')
      .insert([event])
    
    if (error) {
      console.error('Failed to track event:', error)
    }
  } catch (error) {
    console.error('Analytics error:', error)
  }
}

// Convenience methods for common events
export const trackPageView = (path?: string) => {
  trackEvent('page_view', { path: path || window.location.pathname }, { anonymize: true })
}

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('product_view', { product_id: productId, product_name: productName })
}

export const trackAddToCart = (productId: string, quantity: number, price: number) => {
  trackEvent('product_add_to_cart', { product_id: productId, quantity, price })
}

export const trackWishlistAdd = (productId: string) => {
  trackEvent('wishlist_add', { product_id: productId })
}

export const trackSearch = (query: string, resultCount: number) => {
  trackEvent('search_performed', { query, result_count: resultCount })
}

export const trackReviewSubmitted = (productId: string, rating: number) => {
  trackEvent('review_submitted', { product_id: productId, rating })
}

export const trackEmailSubscribed = (preferences?: Record<string, boolean>) => {
  trackEvent('email_subscribed', { preferences })
}

export const trackRecommendationClick = (
  productId: string, 
  recommendationType: 'similar' | 'bought_together' | 'recently_viewed'
) => {
  trackEvent('recommendation_clicked', { 
    product_id: productId, 
    recommendation_type: recommendationType 
  })
} 