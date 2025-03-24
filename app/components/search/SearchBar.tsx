'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
}

export default function SearchBar({
  initialQuery = '',
  onSearch,
  placeholder = 'Search for products...',
  delay = 500,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Create a debounced version of the search handler
  const debouncedFetchSuggestions = debounce(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.data || []);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  }, delay);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedFetchSuggestions(newQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            className="w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-0 top-0 h-full px-3"
          >
            Search
          </Button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-60 overflow-auto rounded-md border border-input bg-background p-1 shadow-md">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="cursor-pointer rounded-sm px-3 py-2 text-sm hover:bg-accent"
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
