'use client';

import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FilterToggleProps {
  showOutOfStock: boolean;
  onChange: (showOutOfStock: boolean) => void;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  showOutOfStock,
  onChange
}) => {
  return (
    <div className="flex items-center">
      <button
        onClick={() => onChange(!showOutOfStock)}
        className={`
          relative inline-flex items-center px-3 py-2 rounded-lg border transition-all duration-200
          ${showOutOfStock 
            ? 'bg-orange-50 border-orange-200 text-orange-700' 
            : 'bg-gray-50 border-gray-200 text-gray-600'
          }
          hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700
        `}
      >
        {showOutOfStock ? (
          <Eye className="h-4 w-4 mr-2" />
        ) : (
          <EyeOff className="h-4 w-4 mr-2" />
        )}
        <span className="text-sm font-medium">
          {showOutOfStock ? 'Hide' : 'Show'} Out of Stock
        </span>
      </button>
    </div>
  );
};
