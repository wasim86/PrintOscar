import { useCurrency } from '@/contexts/CurrencyContext';
import { Currency, BASE_CURRENCY } from '@/types/currency';

/**
 * Hook for price conversion and formatting
 */
export const usePriceUtils = () => {
  const { currentCurrency, convertPrice, formatPrice } = useCurrency();

  /**
   * Convert and format a price from USD to current currency
   */
  const convertAndFormatPrice = (price: number, fromCurrency: string = BASE_CURRENCY): string => {
    const convertedPrice = convertPrice(price, fromCurrency);
    return formatPrice(convertedPrice);
  };

  /**
   * Convert a price without formatting
   */
  const convertPriceOnly = (price: number, fromCurrency: string = BASE_CURRENCY): number => {
    return convertPrice(price, fromCurrency);
  };

  /**
   * Format a price that's already in the current currency
   */
  const formatPriceOnly = (price: number, currency?: Currency): string => {
    return formatPrice(price, currency);
  };

  /**
   * Get price display with original and converted prices
   */
  const getPriceDisplay = (price: number, fromCurrency: string = BASE_CURRENCY) => {
    const convertedPrice = convertPrice(price, fromCurrency);
    const formattedPrice = formatPrice(convertedPrice);
    
    return {
      originalPrice: price,
      convertedPrice,
      formattedPrice,
      currency: currentCurrency,
      isConverted: currentCurrency.code !== fromCurrency
    };
  };

  /**
   * Calculate discount percentage between original and sale prices
   */
  const calculateDiscountPercentage = (originalPrice: number, salePrice: number): number => {
    if (originalPrice <= 0 || salePrice >= originalPrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  /**
   * Format price range (e.g., for product variants)
   */
  const formatPriceRange = (minPrice: number, maxPrice: number, fromCurrency: string = BASE_CURRENCY): string => {
    const convertedMinPrice = convertPrice(minPrice, fromCurrency);
    const convertedMaxPrice = convertPrice(maxPrice, fromCurrency);
    
    if (convertedMinPrice === convertedMaxPrice) {
      return formatPrice(convertedMinPrice);
    }
    
    return `${formatPrice(convertedMinPrice)} - ${formatPrice(convertedMaxPrice)}`;
  };

  return {
    convertAndFormatPrice,
    convertPriceOnly,
    formatPriceOnly,
    getPriceDisplay,
    calculateDiscountPercentage,
    formatPriceRange,
    currentCurrency
  };
};

/**
 * Utility functions that don't require hooks (for use in components that can't use hooks)
 */
export const priceUtils = {
  /**
   * Format number with proper decimal places and thousand separators
   */
  formatNumber: (amount: number, decimalPlaces: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(amount.toFixed(decimalPlaces)));
  },

  /**
   * Round price to appropriate decimal places for currency
   */
  roundPrice: (amount: number, decimalPlaces: number = 2): number => {
    return Number(amount.toFixed(decimalPlaces));
  },

  /**
   * Validate price input
   */
  isValidPrice: (price: any): boolean => {
    return typeof price === 'number' && !isNaN(price) && price >= 0;
  },

  /**
   * Parse price from string
   */
  parsePrice: (priceString: string): number => {
    const cleaned = priceString.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Compare prices with tolerance for floating point precision
   */
  pricesEqual: (price1: number, price2: number, tolerance: number = 0.01): boolean => {
    return Math.abs(price1 - price2) < tolerance;
  }
};
