'use client';

import React from 'react';
import { SearchBar } from './SearchBar';

interface SearchSectionProps {
  className?: string;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  className = "",
}) => {
  const handleSearch = (query: string, category?: string) => {
    // TODO: Implement search functionality with backend
    console.log('Search query:', query, 'Category:', category);
    // Navigate to search results page
    // router.push(`/search?q=${encodeURIComponent(query)}${category ? `&category=${category}` : ''}`);
  };

  return (
    <section className={`bg-gray-50 border-b border-gray-200 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>
    </section>
  );
};
