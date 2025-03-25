'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';

type Category = Database['public']['Tables']['categories']['Row'];
type GrillzMaterial = Database['public']['Enums']['grillz_material'];
type GrillzStyle = Database['public']['Enums']['grillz_style'];

interface SearchFiltersProps {
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  initialFilters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    material?: GrillzMaterial;
    style?: GrillzStyle;
    inStock?: boolean;
  };
  onFilterChange: (filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    material?: GrillzMaterial;
    style?: GrillzStyle;
    inStock?: boolean;
  }) => void;
}

export function SearchFilters({
  categories,
  minPrice,
  maxPrice,
  initialFilters,
  onFilterChange,
}: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: initialFilters?.category || '',
    minPrice: initialFilters?.minPrice || minPrice,
    maxPrice: initialFilters?.maxPrice || maxPrice,
    material: initialFilters?.material || undefined,
    style: initialFilters?.style || undefined,
    inStock: initialFilters?.inStock || false,
  });

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams?.toString() || '');
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    router.push('?' + params.toString());
  }, [filters, onFilterChange, router, searchParams]);

  const handlePriceChange = useCallback(([min, max]: [number, number]) => {
    handleFilterChange({ minPrice: min, maxPrice: max });
  }, [handleFilterChange]);

  const handleReset = useCallback(() => {
    const defaultFilters = {
      category: '',
      minPrice,
      maxPrice,
      material: undefined,
      style: undefined,
      inStock: false,
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
    router.push(window.location.pathname);
  }, [minPrice, maxPrice, onFilterChange, router]);

  const handleCategoryChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...initialFilters,
        category: value || undefined,
      });
    },
    [initialFilters, onFilterChange]
  );

  const handleMaterialChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...initialFilters,
        material: (value as GrillzMaterial) || undefined,
      });
    },
    [initialFilters, onFilterChange]
  );

  const handleStyleChange = useCallback(
    (value: string) => {
      onFilterChange({
        ...initialFilters,
        style: (value as GrillzStyle) || undefined,
      });
    },
    [initialFilters, onFilterChange]
  );

  const handleInStockChange = useCallback(
    (checked: boolean) => {
      onFilterChange({
        ...initialFilters,
        inStock: checked,
      });
    },
    [initialFilters, onFilterChange]
  );

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="mb-4"
        >
          Reset Filters
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Category</Label>
          <Select
            value={filters.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Price Range</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice.toString()}
              onChange={(e) => handlePriceChange([Number(e.target.value), filters.maxPrice])}
              min={minPrice}
              max={maxPrice}
            />
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice.toString()}
              onChange={(e) => handlePriceChange([filters.minPrice, Number(e.target.value)])}
              min={minPrice}
              max={maxPrice}
            />
          </div>
        </div>

        <div>
          <Label>Material</Label>
          <Select
            value={filters.material || ''}
            onValueChange={handleMaterialChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any material</SelectItem>
              <SelectItem value="gold">Gold</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="platinum">Platinum</SelectItem>
              <SelectItem value="rainbow_gold">Rainbow Gold</SelectItem>
              <SelectItem value="diamond_encrusted">Diamond Encrusted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Style</Label>
          <Select
            value={filters.style || ''}
            onValueChange={handleStyleChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any style</SelectItem>
              <SelectItem value="full_set">Full Set</SelectItem>
              <SelectItem value="top_only">Top Only</SelectItem>
              <SelectItem value="bottom_only">Bottom Only</SelectItem>
              <SelectItem value="fangs">Fangs</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={filters.inStock}
            onCheckedChange={handleInStockChange}
          />
          <Label htmlFor="in-stock">In Stock Only</Label>
        </div>
      </div>
    </Card>
  );
}
