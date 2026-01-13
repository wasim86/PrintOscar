import React from 'react';
import { ChevronDown } from 'lucide-react';

interface ProductsPerPageProps {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  options?: number[];
  className?: string;
}

export const ProductsPerPage: React.FC<ProductsPerPageProps> = ({
  pageSize,
  onPageSizeChange,
  options = [12, 24, 36, 48, 60, 96, 108],
  className = ''
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="page-size-select" className="text-sm font-medium text-gray-700">
        Show:
      </label>
      <div className="relative">
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="appearance-none bg-white border border-gray-300 rounded-md px-3 py-1 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};
