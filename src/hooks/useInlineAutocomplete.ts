import { useState, useRef } from 'react';

interface AutocompleteItem {
  name: string;
  avatar?: string;
  [key: string]: any;
}

interface UseInlineAutocompleteOptions<T extends AutocompleteItem> {
  items: T[];
  onSelect: (item: T) => void;
  minChars?: number;
  filterFunction?: (item: T, searchValue: string) => boolean;
}

export function useInlineAutocomplete<T extends AutocompleteItem>({
  items,
  onSelect,
  minChars = 2,
  filterFunction
}: UseInlineAutocompleteOptions<T>) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredItems, setFilteredItems] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  // Default filter function
  const defaultFilter = (item: T, searchValue: string) => {
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  };

  const handleChange = (value: string) => {
    if (value.length >= minChars) {
      const filterFunc = filterFunction || defaultFilter;
      const filtered = items.filter(item => filterFunc(item, value));
      setFilteredItems(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredItems([]);
    }
  };

  const selectSuggestion = (item: T, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onSelect(item);
    setShowSuggestions(false);
    setFilteredItems([]);
    
    // Focus back to input if it exists
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(filteredItems[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const reset = () => {
    setShowSuggestions(false);
    setFilteredItems([]);
    setSelectedIndex(-1);
  };

  return {
    inputRef,
    showSuggestions,
    filteredItems,
    selectedIndex,
    handleChange,
    selectSuggestion,
    handleKeyDown,
    reset
  };
}
