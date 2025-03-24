'use client';

import React, { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';

interface Category {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  currentCategory: string;
  currentMinPrice: string;
  currentMaxPrice: string;
  currentSort: string;
  onFilterChange: (name: string, value: string | null) => void;
}

export default function SearchFilters({
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  currentSort,
  onFilterChange
}: SearchFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([
    parseInt(currentMinPrice || '0', 10),
    parseInt(currentMaxPrice || '1000', 10)
  ]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        
        if (data.success) {
          setCategories(data.data || []);
        } else {
          console.error('Error fetching categories:', data.error);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Update price range when props change
  useEffect(() => {
    setPriceRange([
      parseInt(currentMinPrice || '0', 10),
      parseInt(currentMaxPrice || '1000', 10)
    ]);
  }, [currentMinPrice, currentMaxPrice]);
  
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  const applyPriceRange = () => {
    onFilterChange('min', priceRange[0].toString());
    onFilterChange('max', priceRange[1].toString());
  };
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    onFilterChange('category', checked ? category : null);
  };
  
  const handleSortChange = (value: string) => {
    onFilterChange('sort', value);
  };
  
  const clearAllFilters = () => {
    onFilterChange('category', null);
    onFilterChange('min', null);
    onFilterChange('max', null);
    onFilterChange('sort', 'relevance');
  };
  
  return (
    <div className="sticky top-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Sort By</h3>
          <Select value={currentSort} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Accordion type="single" collapsible defaultValue="categories">
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {isLoading ? (
                  <p className="text-sm text-muted-foreground">Loading categories...</p>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`}
                        checked={currentCategory === category.id}
                        onCheckedChange={(checked) => 
                          handleCategoryChange(category.id, checked === true)
                        }
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No categories found</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="price">
            <AccordionTrigger>Price Range</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={priceRange}
                  max={5000}
                  step={10}
                  value={priceRange}
                  onValueChange={handlePriceRangeChange}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${priceRange[0]}</span>
                  <span className="text-sm">${priceRange[1]}</span>
                </div>
                <Button onClick={applyPriceRange} size="sm" className="w-full">
                  Apply Price Range
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
