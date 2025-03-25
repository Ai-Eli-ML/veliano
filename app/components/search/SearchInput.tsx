'use client';

import { useState, useCallback, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchInputProps {
  initialValue?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export function SearchInput({
  initialValue = '',
  onSearch,
  isLoading = false,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      onSearch(value);
    },
    [value, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <Input
        type="search"
        placeholder="Search for products..."
        value={value}
        onChange={handleChange}
        className="pr-10"
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        disabled={isLoading}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
} 