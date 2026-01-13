import React from 'react';

interface ProductCountProps {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  displayedCount: number;
  className?: string;
}

export const ProductCount: React.FC<ProductCountProps> = ({
  currentPage,
  pageSize,
  totalCount,
  displayedCount,
  className = ''
}) => {
  // Calculate the range of products being shown
  const startIndex = totalCount > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endIndex = Math.min(currentPage * pageSize, totalCount);

  // Format numbers with commas for better readability
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  if (totalCount === 0) {
    return (
      <div className={`text-gray-600 ${className}`}>
        No products found
      </div>
    );
  }

  return (
    <div className={`text-gray-600 ${className}`}>
      <span className="font-medium">
        Showing {formatNumber(startIndex)}-{formatNumber(endIndex)} of {formatNumber(totalCount)} products
      </span>
      {displayedCount !== totalCount && (
        <span className="text-sm text-gray-500 ml-2">
          ({formatNumber(displayedCount)} filtered)
        </span>
      )}
    </div>
  );
};
