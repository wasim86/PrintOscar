'use client';

import React from 'react';
import { usePriceUtils } from '@/utils/priceUtils';
import { BASE_CURRENCY } from '@/types/currency';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  salePrice?: number;
  fromCurrency?: string;
  className?: string;
  showOriginal?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSaleBadge?: boolean;
  saleBadgeText?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  salePrice,
  fromCurrency = BASE_CURRENCY,
  className = '',
  showOriginal = true,
  size = 'md',
  showSaleBadge = true,
  saleBadgeText = 'SALE'
}) => {
  const { convertAndFormatPrice, calculateDiscountPercentage } = usePriceUtils();

  // Determine which prices to display
  const displayPrice = salePrice || price;
  const hasDiscount = originalPrice && originalPrice > displayPrice;
  const discountPercentage = hasDiscount ? calculateDiscountPercentage(originalPrice, displayPrice) : 0;

  // Size classes
  const sizeClasses = {
    sm: {
      price: 'text-sm font-semibold',
      original: 'text-xs',
      badge: 'text-xs px-1.5 py-0.5'
    },
    md: {
      price: 'text-lg font-bold',
      original: 'text-sm',
      badge: 'text-xs px-2 py-1'
    },
    lg: {
      price: 'text-2xl font-bold',
      original: 'text-lg',
      badge: 'text-sm px-2 py-1'
    },
    xl: {
      price: 'text-3xl font-bold',
      original: 'text-xl',
      badge: 'text-sm px-2 py-1'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Current Price */}
      <span className={`${classes.price} text-gray-900`}>
        {convertAndFormatPrice(displayPrice, fromCurrency)}
      </span>

      {/* Original Price (if on sale) */}
      {hasDiscount && showOriginal && (
        <span className={`${classes.original} text-gray-500 line-through`}>
          {convertAndFormatPrice(originalPrice, fromCurrency)}
        </span>
      )}

      {/* Sale Badge */}
      {hasDiscount && showSaleBadge && (
        <span className={`${classes.badge} bg-red-100 text-red-800 font-medium rounded`}>
          {discountPercentage > 0 ? `${discountPercentage}% OFF` : saleBadgeText}
        </span>
      )}
    </div>
  );
};

interface PriceRangeDisplayProps {
  minPrice: number;
  maxPrice: number;
  fromCurrency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PriceRangeDisplay: React.FC<PriceRangeDisplayProps> = ({
  minPrice,
  maxPrice,
  fromCurrency = BASE_CURRENCY,
  className = '',
  size = 'md'
}) => {
  const { formatPriceRange } = usePriceUtils();

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  return (
    <span className={`${sizeClasses[size]} text-gray-900 ${className}`}>
      {formatPriceRange(minPrice, maxPrice, fromCurrency)}
    </span>
  );
};

interface SimplePriceDisplayProps {
  price: number;
  fromCurrency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SimplePriceDisplay: React.FC<SimplePriceDisplayProps> = ({
  price,
  fromCurrency = BASE_CURRENCY,
  className = '',
  size = 'md'
}) => {
  const { convertAndFormatPrice } = usePriceUtils();

  const sizeClasses = {
    sm: 'text-sm font-semibold',
    md: 'text-lg font-bold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold'
  };

  return (
    <span className={`${sizeClasses[size]} text-gray-900 ${className}`}>
      {convertAndFormatPrice(price, fromCurrency)}
    </span>
  );
};
