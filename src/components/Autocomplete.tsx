import React, { useRef, useEffect, useState } from 'react';

export interface AutocompleteOption {
  label: string;
  value: string;
  avatar?: string;
  subtitle?: string;
  data?: any;
}

export interface AutocompleteProps {
  value: string;
  onChange: (value: string, option?: AutocompleteOption) => void;
  options: AutocompleteOption[];
  placeholder?: string;
  minCharsToShowSuggestions?: number;
  className?: string;
  inputClassName?: string;
  suggestionsClassName?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  filterFunction?: (option: AutocompleteOption, searchValue: string) => boolean;
  renderOption?: (option: AutocompleteOption, isSelected: boolean) => React.ReactNode;
  onSelect?: (option: AutocompleteOption) => void;
  autoComplete?: string;
}

export default function Autocomplete({
  value,
  onChange,
  options,
  placeholder = 'Type to search...',
  minCharsToShowSuggestions = 2,
  className = '',
  inputClassName = '',
  suggestionsClassName = '',
  label,
  error,
  disabled = false,
  filterFunction,
  renderOption,
  onSelect,
  autoComplete = 'off',
}: AutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<AutocompleteOption[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Default filter function
  const defaultFilterFunction = (option: AutocompleteOption, searchValue: string) => {
    const searchLower = searchValue.toLowerCase();
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower) ||
      (option.subtitle && option.subtitle.toLowerCase().includes(searchLower))
    );
  };

  // Handle value change
  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    if (inputValue.length >= minCharsToShowSuggestions) {
      const filterFunc = filterFunction || defaultFilterFunction;
      const filtered = options.filter(option => filterFunc(option, inputValue));
      setFilteredOptions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredOptions([]);
    }
  };

  // Handle option selection
  const handleSelect = (option: AutocompleteOption) => {
    onChange(option.value, option);
    setShowSuggestions(false);
    setFilteredOptions([]);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(option);
    }
    
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredOptions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredOptions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredOptions[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Default render option function
  const defaultRenderOption = (option: AutocompleteOption, isSelected: boolean) => {
    if (option.avatar) {
      return (
        <div
          className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
            isSelected
              ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
              : "hover:bg-gray-100 dark:hover:bg-gray-600"
          }`}
        >
          <img 
            src={option.avatar} 
            alt={option.label}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">{option.label}</span>
            {option.subtitle && (
              <span className="text-sm text-gray-500 dark:text-gray-400">{option.subtitle}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`px-4 py-2 cursor-pointer transition-colors ${
          isSelected
            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
            : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
        }`}
      >
        {option.label}
        {option.subtitle && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({option.subtitle})</span>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={
            inputClassName ||
            "w-full px-3 py-2 border border-blue-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          }
        />
        {showSuggestions && filteredOptions.length > 0 && (
          <div
            ref={suggestionsRef}
            className={
              suggestionsClassName ||
              "absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
            }
          >
            {filteredOptions.map((option, index) => (
              <div
                key={`${option.value}-${index}`}
                onClick={() => handleSelect(option)}
              >
                {renderOption 
                  ? renderOption(option, index === selectedIndex)
                  : defaultRenderOption(option, index === selectedIndex)
                }
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
