
'use client';

import { type FC, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAutocompleteSuggestions } from '@/actions/search';
import { AutocompleteResult } from '@/types/search';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  initialQuery?: string;
}

export const SearchBar: FC<SearchBarProps> = ({
  className,
  placeholder = 'Search products...',
  initialQuery = ''
}) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  // Fetch autocomplete suggestions when the debounced query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length >= 2) {
        setIsLoading(true);
        try {
          const result = await getAutocompleteSuggestions(debouncedQuery);
          if (result.success && result.data) {
            setSuggestions(result.data);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);
  
  // Handle form submission
  const handleSearch = (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    
    // Navigate to search page with query
    router.push('/search?q=' + encodeURIComponent(searchQuery.trim()));
    setShowAutocomplete(false);
  };
  
  // Handle selecting a suggestion
  const handleSelectSuggestion = (term: string) => {
    setQuery(term);
    handleSearch(term);
    setSuggestions([]);
    setShowAutocomplete(false);
  };
  
  return (
    <div className={'relative w-full max-w-md ' + className}>
      <Popover open={showAutocomplete} onOpenChange={setShowAutocomplete}>
        <PopoverAnchor>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex w-full items-center"
          >
            <Input
              type="search"
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowAutocomplete(e.target.value.length >= 2);
              }}
              onFocus={() => setShowAutocomplete(query.length >= 2)}
              className="w-full pr-10"
              ref={inputRef}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-1"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </PopoverAnchor>
        
        <PopoverContent
          className="p-0 w-[calc(100%-2rem)]"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command>
            <CommandList>
              {isLoading ? (
                <div className="p-2 text-center text-sm text-muted-foreground">
                  Loading suggestions...
                </div>
              ) : suggestions.length > 0 ? (
                <CommandGroup heading="Suggestions">
                  {suggestions.map((suggestion, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => handleSelectSuggestion(suggestion.term)}
                      className="flex justify-between"
                    >
                      <span>{suggestion.term}</span>
                      <span className="text-muted-foreground text-xs">
                        {suggestion.count} results
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : (
                query.length >= 2 && (
                  <div className="p-2 text-center text-sm text-muted-foreground">
                    No suggestions found
                  </div>
                )
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
