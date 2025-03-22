'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchFormProps {
  defaultValue?: string;
}

export default function SearchForm({ defaultValue = '' }: SearchFormProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(defaultValue);

  // Update the search term state when the defaultValue prop changes
  useEffect(() => {
    setSearchTerm(defaultValue);
  }, [defaultValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    
    if (trimmedSearch) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearch)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-lg gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
} 