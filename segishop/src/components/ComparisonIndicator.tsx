'use client';

import React from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';
import { useComparison } from '@/contexts/ComparisonContext';

interface ComparisonIndicatorProps {
  className?: string;
  showText?: boolean;
}

export const ComparisonIndicator: React.FC<ComparisonIndicatorProps> = ({
  className = '',
  showText = false
}) => {
  const { comparisonCount } = useComparison();

  if (comparisonCount === 0) {
    return null;
  }

  return (
    <Link
      href="/compare"
      className={`relative inline-flex items-center hover:text-blue-600 transition-colors group ${className}`}
      title={`View ${comparisonCount} product${comparisonCount !== 1 ? 's' : ''} in comparison`}
    >
      <Scale className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors" />

      {/* Count Badge */}
      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
        {comparisonCount}
      </span>

      {/* Optional Text */}
      {showText && (
        <span className="ml-2 text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
          Compare ({comparisonCount})
        </span>
      )}

      {/* Tooltip on hover */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
        View {comparisonCount} product{comparisonCount !== 1 ? 's' : ''} in comparison
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
      </div>
    </Link>
  );
};

export default ComparisonIndicator;
