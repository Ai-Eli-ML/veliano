
'use client';

import { type FC, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { Category } from '@/types/category';

interface SearchFiltersProps {
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialCategoryId?: string;
  initialSortBy?: string;
  priceRange: {
    min: number;
    max: number;
  };
  categories: Category[];
}

export const SearchFilters: FC<SearchFiltersProps> = ({
  initialMinPrice,
  initialMaxPrice,
  initialCategoryId,
  initialSortBy = 'relevance',
  priceRange,
  categories
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [priceValues, setPriceValues] = useState<[number, number]>([
    initialMinPrice ?? priceRange.min,
    initialMaxPrice ?? priceRange.max
  ]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategoryId
  );
  
  const [sortBy, setSortBy] = useState(initialSortBy);
  
  // Apply filters function
  const applyFilters = () => {
    // Get current search query
    const query = searchParams.get('q') || '';
    
    // Construct new URL with updated filters
    const url = new URL('/search', window.location.origin);
    url.searchParams.set('q', query);
    
    // Add filters
    if (selectedCategory) {
      url.searchParams.set('category', selectedCategory);
    }
    
    // Only add price filters if they're different from the default range
    if (priceValues[0] > priceRange.min) {
      url.searchParams.set('min', priceValues[0].toString());
    }
    
    if (priceValues[1] < priceRange.max) {
      url.searchParams.set('max', priceValues[1].toString());
    }
    
    if (sortBy !== 'relevance') {
      url.searchParams.set('sort', sortBy);
    }
    
    // Navigate to the new URL
    router.push(url.pathname + url.search);
  };
  
  // Reset filters
  const resetFilters = () => {
    setPriceValues([priceRange.min, priceRange.max]);
    setSelectedCategory(undefined);
    setSortBy('relevance');
    
    // Get current search query
    const query = searchParams.get('q') || '';
    
    // Navigate to base search URL with only the query
    router.push('/search?q=' + encodeURIComponent(query));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-2">
          <h3 className="font-medium">Price Range</h3>
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            value={priceValues}
            onValueChange={(value) => setPriceValues(value as [number, number])}
          />
          <div className="flex items-center justify-between text-sm">
            <span>${priceValues[0]}</span>
            <span>${priceValues[1]}</span>
          </div>
        </div>
        
        {/* Categories */}
        <div className="space-y-2">
          <h3 className="font-medium">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategory === category.id}
                  onCheckedChange={(checked) => {
                    setSelectedCategory(checked ? category.id : undefined);
                  }}
                />
                <Label htmlFor={category.id}>{category.name}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sort By */}
        <div className="space-y-2">
          <h3 className="font-medium">Sort By</h3>
          <RadioGroup
            value={sortBy}
            onValueChange={setSortBy}
            className="space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="relevance" id="relevance" />
              <Label htmlFor="relevance">Relevance</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_asc" id="price_asc" />
              <Label htmlFor="price_asc">Price: Low to High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="price_desc" id="price_desc" />
              <Label htmlFor="price_desc">Price: High to Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newest" id="newest" />
              <Label htmlFor="newest">Newest First</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2 pt-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          <Button variant="outline" onClick={resetFilters}>Reset</Button>
        </div>
      </CardContent>
    </Card>
  );
};
