'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, ChevronDown } from 'lucide-react';
import api from '@/services/api';
import { convertApiCategoryToFrontend, convertApiProductToFrontend, FrontendCategory } from '@/types/api';

interface SearchBarProps {
  onSearch?: (query: string, category?: string) => void;
  placeholder?: string;
  className?: string;
}

interface ProductSuggestion {
  id: string;
  name: string;
  slug: string;
  price: number;
  categoryName: string;
  imageUrl?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Search products...",
  className = "",
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Load categories on component mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.getCategories();
        if (response.success && response.categories) {
          const frontendCategories = response.categories.map(convertApiCategoryToFrontend);
          // Include all main parent categories (categories without a parent)
          const mainCategories = frontendCategories;
          setCategories(mainCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Fetch product suggestions based on query
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length > 2) { // Start searching after 3 characters
        try {
          setLoading(true);
          const response = await api.searchProducts({
            searchTerm: query,
            page: 1,
            pageSize: 5 // Limit to 5 suggestions
          });

          if (response.success && response.data?.products) {
            const productSuggestions: ProductSuggestion[] = response.data.products.map((product: any) => ({
              id: product.id.toString(),
              name: product.name,
              slug: product.slug || `product-${product.id}`,
              price: product.salePrice || product.price,
              categoryName: product.categoryName,
              imageUrl: product.imageUrl
            }));

            setSuggestions(productSuggestions);
            setShowSuggestions(true);
          } else {
            setSuggestions([]);
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const s = searchParams.get('search') || '';
    setQuery(s);
    setShowSuggestions(false);
  }, [searchParams, pathname]);

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery.trim(), selectedCategory !== 'all' ? selectedCategory : undefined);
      setShowSuggestions(false);

      // Navigate to products page with search query and category
      const params = new URLSearchParams();
      params.set('search', searchQuery.trim());
      if (selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }
      router.push(`/products?${params.toString()}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion: ProductSuggestion) => {
    // Navigate to product detail page
    router.push(`/products/${suggestion.slug}`);
    setShowSuggestions(false);
    setQuery('');
  };

  // Create category options with API data
  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({
      value: cat.slug || cat.id,
      label: cat.name
    }))
  ];

  const selectedCategoryLabel = categoryOptions.find(cat => cat.value === selectedCategory)?.label || 'All Categories';

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-stretch">
        {/* Category Dropdown */}
        <div ref={categoryRef} className="relative">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center px-3 sm:px-5 py-3 bg-gray-800 border border-r-0 border-gray-600 rounded-l-lg hover:bg-gray-700 transition-colors duration-200 min-w-[120px] sm:min-w-[180px] h-full"
          >
            <span className="text-xs sm:text-sm text-gray-200 truncate font-medium">{selectedCategoryLabel}</span>
            <ChevronDown className="ml-1 sm:ml-3 h-4 w-4 text-gray-500 flex-shrink-0" />
          </button>

          {/* Category Dropdown Menu */}
          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 sm:w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-1 z-50 max-h-60 overflow-y-auto">
              {categoryOptions.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setShowCategoryDropdown(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200 ${
                    selectedCategory === category.value
                      ? 'bg-gray-700 text-yellow-400'
                      : 'text-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Input */}
        <div ref={searchRef} className="relative flex-1 flex">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            className="w-full pl-3 sm:pl-5 pr-12 sm:pr-14 py-3 border border-gray-600 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all duration-200 text-sm sm:text-base h-full placeholder-gray-400"
          />

          {/* Search Button */}
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-4 sm:px-6 bg-yellow-500 text-black rounded-r-lg hover:bg-yellow-400 focus:bg-yellow-400 transition-colors duration-200 flex items-center justify-center shadow-md hover:shadow-lg font-medium"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-1 z-50">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 hover:text-yellow-400 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    {suggestion.imageUrl ? (
                      <img
                        src={suggestion.imageUrl}
                        alt={suggestion.name}
                        className="h-8 w-8 object-cover rounded mr-2 flex-shrink-0"
                      />
                    ) : (
                      <Search className="h-3 w-3 mr-2 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{suggestion.name}</div>
                      <div className="text-xs text-gray-400 truncate">
                        ${suggestion.price.toFixed(2)} • {suggestion.categoryName}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {loading && query.length > 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-600 py-2 z-50">
              <div className="flex items-center justify-center text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400 mr-2"></div>
                Searching...
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
