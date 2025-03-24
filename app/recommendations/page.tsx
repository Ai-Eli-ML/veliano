import { Metadata } from 'next'
import ProductRecommendations from '@/components/recommendations/ProductRecommendations'

export const metadata: Metadata = {
  title: 'Recommended Products | Veliano Jewelry',
  description: 'Discover personalized jewelry recommendations based on your preferences and browsing history',
}

export default function RecommendationsPage() {
  return (
    <div className="container px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Recommended for You</h1>
        <p className="mt-2 text-muted-foreground">
          Personalized recommendations based on your style and preferences.
        </p>
      </div>
      
      <ProductRecommendations />
    </div>
  )
} 