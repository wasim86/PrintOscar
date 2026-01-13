'use client';

import React from 'react';
import { Check, Star, Info } from 'lucide-react';
import { ProductHighlight } from '@/services/simple-products-api';

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
  className?: string;
  variant?: 'default' | 'compact' | 'featured';
}

export const ProductHighlights: React.FC<ProductHighlightsProps> = ({
  highlights,
  className = '',
  variant = 'default'
}) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  // Sort highlights by sort order
  const sortedHighlights = [...highlights].sort((a, b) => a.sortOrder - b.sortOrder);

  const getIcon = (highlight: string) => {
    const lowerHighlight = highlight.toLowerCase();
    
    // Check for different types of highlights and return appropriate icons
    if (lowerHighlight.includes('ingredient') || lowerHighlight.includes('made with')) {
      return <Info className="h-4 w-4 text-orange-500" />;
    }
    if (lowerHighlight.includes('oz') || lowerHighlight.includes('g') || lowerHighlight.includes('size')) {
      return <Star className="h-4 w-4 text-yellow-500 fill-current" />;
    }
    if (lowerHighlight.includes('bulk') || lowerHighlight.includes('pack')) {
      return <Star className="h-4 w-4 text-orange-500 fill-current" />;
    }
    
    // Default check icon
    return <Check className="h-4 w-4 text-green-500" />;
  };

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        <h4 className="text-sm font-medium text-gray-900">Key Features</h4>
        <div className="flex flex-wrap gap-2">
          {sortedHighlights.map((highlight) => (
            <span
              key={highlight.id}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {getIcon(highlight.highlight)}
              <span className="ml-1">{highlight.highlight}</span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-2" />
          Product Highlights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedHighlights.map((highlight, index) => (
            <div
              key={highlight.id}
              className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(highlight.highlight)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {highlight.highlight}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-base font-medium text-gray-900">Product Highlights</h3>
      <ul className="space-y-2">
        {sortedHighlights.map((highlight) => (
          <li
            key={highlight.id}
            className="flex items-start space-x-3 text-sm text-gray-700"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(highlight.highlight)}
            </div>
            <span className="flex-1">{highlight.highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper component for inline highlights (for use in product cards, etc.)
export const InlineHighlights: React.FC<{
  highlights: ProductHighlight[];
  maxItems?: number;
  className?: string;
}> = ({ highlights, maxItems = 3, className = '' }) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  const sortedHighlights = [...highlights]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, maxItems);

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {sortedHighlights.map((highlight) => (
        <span
          key={highlight.id}
          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
        >
          {highlight.highlight}
        </span>
      ))}
      {highlights.length > maxItems && (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
          +{highlights.length - maxItems} more
        </span>
      )}
    </div>
  );
};
