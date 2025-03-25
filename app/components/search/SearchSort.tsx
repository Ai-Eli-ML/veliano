'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'newest';

interface SearchSortProps {
  initialSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function SearchSort({ initialSort, onSortChange }: SearchSortProps) {
  return (
    <Select value={initialSort} onValueChange={(value) => onSortChange(value as SortOption)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="relevance">Most Relevant</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest First</SelectItem>
      </SelectContent>
    </Select>
  );
} 