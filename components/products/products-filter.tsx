'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Plus, Minus } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ProductsFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [expanded, setExpanded] = useState({
    categories: true,
    price: true,
    material: true,
    style: false
  });
  
  const [priceRange, setPriceRange] = useState([0, 5000]);
  
  const createQueryString = (name: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === null) {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    
    // Reset page when filter changes
    if (name !== 'page') {
      params.delete('page');
    }
    
    return params.toString();
  };
  
  const toggleExpanded = (section: keyof typeof expanded) => {
    setExpanded(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const handleFilterChange = (name: string, value: string | null) => {
    router.push(`${pathname}?${createQueryString(name, value)}`, { scroll: false });
  };
  
  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
  };
  
  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', priceRange[0].toString());
    params.set('maxPrice', priceRange[1].toString());
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  // Mock categories for example
  const categories = [
    { id: 'grillz', name: 'Custom Grillz' },
    { id: 'rings', name: 'Rings' },
    { id: 'pendants', name: 'Pendants' },
    { id: 'chains', name: 'Chains' },
    { id: 'bracelets', name: 'Bracelets' }
  ];
  
  // Mock materials for example
  const materials = [
    { id: 'gold_10k', name: '10K Gold' },
    { id: 'gold_14k', name: '14K Gold' },
    { id: 'gold_18k', name: '18K Gold' },
    { id: 'silver_925', name: '925 Silver' },
    { id: 'platinum', name: 'Platinum' }
  ];
  
  // Mock styles for example
  const styles = [
    { id: 'open_face', name: 'Open Face' },
    { id: 'closed_face', name: 'Closed Face' },
    { id: 'diamond_cut', name: 'Diamond Cut' },
    { id: 'custom', name: 'Custom' }
  ];
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">Filters</h2>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-center"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
      
      {/* Categories Filter */}
      <div className="border-b pb-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium mb-2"
          onClick={() => toggleExpanded('categories')}
        >
          Categories
          {expanded.categories ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expanded.categories && (
          <div className="mt-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex w-full items-center text-sm py-1 hover:text-primary"
                onClick={() => handleFilterChange('category', category.id)}
              >
                <div className={cn(
                  "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
                  searchParams.get('category') === category.id ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {searchParams.get('category') === category.id && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Price Range Filter */}
      <div className="border-b pb-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium mb-2"
          onClick={() => toggleExpanded('price')}
        >
          Price Range
          {expanded.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expanded.price && (
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            
            <Slider
              defaultValue={[0, 5000]}
              min={0}
              max={5000}
              step={100}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="my-4"
            />
            
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full mt-2"
              onClick={applyPriceRange}
            >
              Apply
            </Button>
          </div>
        )}
      </div>
      
      {/* Material Filter */}
      <div className="border-b pb-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium mb-2"
          onClick={() => toggleExpanded('material')}
        >
          Material
          {expanded.material ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expanded.material && (
          <div className="mt-2 space-y-1">
            {materials.map((material) => (
              <button
                key={material.id}
                className="flex w-full items-center text-sm py-1 hover:text-primary"
                onClick={() => handleFilterChange('material', material.id)}
              >
                <div className={cn(
                  "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
                  searchParams.get('material') === material.id ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {searchParams.get('material') === material.id && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                {material.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Style Filter (Grillz specific) */}
      <div className="border-b pb-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium mb-2"
          onClick={() => toggleExpanded('style')}
        >
          Style (Grillz)
          {expanded.style ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        
        {expanded.style && (
          <div className="mt-2 space-y-1">
            {styles.map((style) => (
              <button
                key={style.id}
                className="flex w-full items-center text-sm py-1 hover:text-primary"
                onClick={() => handleFilterChange('style', style.id)}
              >
                <div className={cn(
                  "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
                  searchParams.get('style') === style.id ? "bg-primary border-primary" : "border-gray-300"
                )}>
                  {searchParams.get('style') === style.id && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                {style.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Featured/New quick filters */}
      <div className="space-y-2">
        <div className="flex items-center">
          <button 
            className="flex items-center text-sm hover:text-primary"
            onClick={() => handleFilterChange('featured', searchParams.get('featured') === 'true' ? null : 'true')}
          >
            <div className={cn(
              "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
              searchParams.get('featured') === 'true' ? "bg-primary border-primary" : "border-gray-300"
            )}>
              {searchParams.get('featured') === 'true' && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            Featured Items
          </button>
        </div>
        
        <div className="flex items-center">
          <button 
            className="flex items-center text-sm hover:text-primary"
            onClick={() => handleFilterChange('new', searchParams.get('new') === 'true' ? null : 'true')}
          >
            <div className={cn(
              "mr-2 h-4 w-4 rounded-sm border flex items-center justify-center",
              searchParams.get('new') === 'true' ? "bg-primary border-primary" : "border-gray-300"
            )}>
              {searchParams.get('new') === 'true' && (
                <Check className="h-3 w-3 text-white" />
              )}
            </div>
            New Arrivals
          </button>
        </div>
      </div>
    </div>
  );
} 