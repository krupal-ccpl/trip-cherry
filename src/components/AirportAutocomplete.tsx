import React, { useState, useRef, useEffect } from 'react';
import { searchAirports } from '../data/airports-data';
import type { Airport } from '../data/airports-data';

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string, airport?: Airport) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export default function AirportAutocomplete({
  value,
  onChange,
  placeholder = 'Search airport...',
  label,
  error,
  disabled = false,
  className = '',
}: AirportAutocompleteProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [inputValue, setInputValue] = useState(value);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input change
  const handleInputChange = (searchValue: string) => {
    setInputValue(searchValue);
    
    if (searchValue.length >= 2) {
      const results = searchAirports(searchValue);
      setFilteredAirports(results);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setShowSuggestions(false);
      setFilteredAirports([]);
    }
  };

  // Handle airport selection
  const handleSelect = (airport: Airport) => {
    const formattedValue = `${airport.code} - ${airport.city}`;
    setInputValue(formattedValue);
    onChange(airport.code, airport);
    setShowSuggestions(false);
    setFilteredAirports([]);
    setSelectedIndex(-1);
  };

  // Handle blur - clear if no valid selection
  const handleBlur = () => {
    setTimeout(() => {
      if (showSuggestions) return; // Don't clear if clicking on suggestions
      
      // Check if input is empty or if it's a valid airport code (3 letters)
      const trimmedInput = inputValue.trim();
      if (!trimmedInput) {
        onChange('');
        setInputValue('');
        return;
      }
      
      // Check if the current input matches a valid airport code format
      const codeMatch = trimmedInput.match(/^([A-Z]{3})(?:\\s|$|-)/);
      if (!codeMatch) {
        // Invalid format, clear it
        setInputValue('');
        onChange('');
      }
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredAirports.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredAirports.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(filteredAirports[selectedIndex]);
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

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

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
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {showSuggestions && filteredAirports.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-64 overflow-y-auto"
          >
            {filteredAirports.map((airport, index) => (
              <div
                key={`${airport.code}-${index}`}
                onClick={() => handleSelect(airport)}
                className={`px-4 py-3 cursor-pointer transition-colors border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                  index === selectedIndex
                    ? "bg-blue-100 dark:bg-blue-900"
                    : "hover:bg-gray-100 dark:hover:bg-gray-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-600 dark:text-blue-400 text-base">
                        {airport.code}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {airport.city}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1 line-clamp-1">
                      {airport.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {airport.country}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {showSuggestions && filteredAirports.length === 0 && inputValue.length >= 2 && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-4">
            <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
              No airports found. Try searching by code, city, or airport name.
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
