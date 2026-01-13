'use client';

import { useState, useEffect, useCallback } from 'react';
import { filtersApi } from '@/services/api';
import { FilterOption, FilterOptionValue } from '@/types/api';

export interface FilterOptionWithCounts extends FilterOption {
  filterOptionValues: FilterOptionValueWithCount[];
}

export interface FilterOptionValueWithCount extends FilterOptionValue {
  count: number;
  isDisabled: boolean;
}

interface UseFilterCountsProps {
  categoryId?: number;
  appliedFilters: Record<string, string[]>;
  products?: any[]; // For fallback calculation
}

interface FilterCountsState {
  filterCounts: Record<string, Record<string, number>>;
  loading: boolean;
  error: string | null;
}

export const useFilterCounts = ({ categoryId, appliedFilters, products = [] }: UseFilterCountsProps) => {
  const [state, setState] = useState<FilterCountsState>({
    filterCounts: {},
    loading: false,
    error: null
  });

  // Calculate filter counts from products (fallback method)
  const calculateFilterCountsFromProducts = useCallback((
    products: any[],
    currentFilters: Record<string, string[]>
  ): Record<string, Record<string, number>> => {
    const counts: Record<string, Record<string, number>> = {};

    if (!products.length) return counts;

    // For each filter type, calculate how many products would match if that filter were applied
    const filterTypes = ['Category', 'Brand', 'Color', 'Size', 'Taste', 'Flavor', 'Diet'];

    filterTypes.forEach(filterType => {
      counts[filterType] = {};

      // Get all unique values for this filter type from products
      const allValues = new Set<string>();
      products.forEach(product => {
        // Extract values based on filter type
        switch (filterType) {
          case 'Category':
            if (product.categoryName) allValues.add(product.categoryName);
            break;
          case 'Brand':
            if (product.brand) allValues.add(product.brand);
            break;
          case 'Color':
            if (product.colors) {
              product.colors.forEach((color: string) => allValues.add(color));
            }
            break;
          case 'Size':
            if (product.sizes) {
              product.sizes.forEach((size: string) => allValues.add(size));
            }
            break;
          case 'Taste':
          case 'Flavor':
          case 'Diet':
            // Extract from product attributes or filter values
            if (product.filterValues) {
              product.filterValues
                .filter((fv: any) => fv.filterDisplayName === filterType)
                .forEach((fv: any) => {
                  if (fv.displayValue) allValues.add(fv.displayValue);
                });
            }
            break;
        }
      });

      // For each value, count how many products would match if this filter were applied
      allValues.forEach(value => {
        // Create a test filter set that includes current filters plus this new filter
        const testFilters = { ...currentFilters };
        
        // Don't include the current filter type in the test (to see what would happen if we added this filter)
        const otherFilters = { ...testFilters };
        delete otherFilters[filterType];

        // Count products that match all other filters and would also match this filter value
        const matchingProducts = products.filter(product => {
          // Check if product matches all other applied filters
          const matchesOtherFilters = Object.entries(otherFilters).every(([filterName, filterValues]) => {
            if (!filterValues.length) return true;

            switch (filterName) {
              case 'Category':
                return filterValues.includes(product.categoryName);
              case 'Brand':
                return filterValues.includes(product.brand);
              case 'Color':
                return product.colors && product.colors.some((color: string) => filterValues.includes(color));
              case 'Size':
                return product.sizes && product.sizes.some((size: string) => filterValues.includes(size));
              case 'StockStatus':
                if (filterValues.includes('in-stock')) return product.stock > 0;
                if (filterValues.includes('out-of-stock')) return product.stock <= 0;
                return true;
              default:
                // Handle custom filter attributes
                return product.filterValues && product.filterValues.some((fv: any) => 
                  fv.filterDisplayName === filterName && filterValues.includes(fv.displayValue)
                );
            }
          });

          if (!matchesOtherFilters) return false;

          // Check if product matches this specific filter value
          switch (filterType) {
            case 'Category':
              return product.categoryName === value;
            case 'Brand':
              return product.brand === value;
            case 'Color':
              return product.colors && product.colors.includes(value);
            case 'Size':
              return product.sizes && product.sizes.includes(value);
            default:
              return product.filterValues && product.filterValues.some((fv: any) => 
                fv.filterDisplayName === filterType && fv.displayValue === value
              );
          }
        });

        counts[filterType][value] = matchingProducts.length;
      });
    });

    // Add stock status counts
    counts['StockStatus'] = {};
    const testFiltersWithoutStock = { ...currentFilters };
    delete testFiltersWithoutStock['StockStatus'];

    const productsMatchingOtherFilters = products.filter(product => {
      return Object.entries(testFiltersWithoutStock).every(([filterName, filterValues]) => {
        if (!filterValues.length) return true;

        switch (filterName) {
          case 'Category':
            return filterValues.includes(product.categoryName);
          case 'Brand':
            return filterValues.includes(product.brand);
          case 'Color':
            return product.colors && product.colors.some((color: string) => filterValues.includes(color));
          case 'Size':
            return product.sizes && product.sizes.some((size: string) => filterValues.includes(size));
          default:
            return product.filterValues && product.filterValues.some((fv: any) => 
              fv.filterDisplayName === filterName && filterValues.includes(fv.displayValue)
            );
        }
      });
    });

    counts['StockStatus']['in-stock'] = productsMatchingOtherFilters.filter(p => p.stock > 0).length;
    counts['StockStatus']['out-of-stock'] = productsMatchingOtherFilters.filter(p => p.stock <= 0).length;

    return counts;
  }, []);

  // Fetch filter counts from API
  const fetchFilterCounts = useCallback(async () => {
    if (!categoryId) {
      setState(prev => ({ ...prev, filterCounts: {}, loading: false }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Try to get counts from API first
      const response = await filtersApi.getFilterCounts(categoryId, appliedFilters);
      
      if (response.success && response.filterCounts) {
        setState(prev => ({
          ...prev,
          filterCounts: response.filterCounts,
          loading: false
        }));
      } else {
        throw new Error('API response unsuccessful');
      }
    } catch (error) {
      console.warn('Failed to fetch filter counts from API, falling back to client-side calculation:', error);
      
      // Fallback to client-side calculation
      const calculatedCounts = calculateFilterCountsFromProducts(products, appliedFilters);
      
      setState(prev => ({
        ...prev,
        filterCounts: calculatedCounts,
        loading: false,
        error: null
      }));
    }
  }, [categoryId, appliedFilters, products, calculateFilterCountsFromProducts]);

  // Fetch counts when dependencies change
  useEffect(() => {
    fetchFilterCounts();
  }, [fetchFilterCounts]);

  // Helper function to get count for a specific filter value
  const getFilterValueCount = useCallback((filterName: string, value: string): number => {
    return state.filterCounts[filterName]?.[value] || 0;
  }, [state.filterCounts]);

  // Helper function to check if a filter value should be disabled (count = 0)
  const isFilterValueDisabled = useCallback((filterName: string, value: string): boolean => {
    const count = getFilterValueCount(filterName, value);
    return count === 0;
  }, [getFilterValueCount]);

  // Helper function to enhance filter options with counts
  const enhanceFiltersWithCounts = useCallback((filters: FilterOption[]): FilterOptionWithCounts[] => {
    return filters.map(filter => ({
      ...filter,
      filterOptionValues: filter.filterOptionValues.map(value => ({
        ...value,
        count: getFilterValueCount(filter.name, value.value),
        isDisabled: isFilterValueDisabled(filter.name, value.value)
      }))
    }));
  }, [getFilterValueCount, isFilterValueDisabled]);

  return {
    filterCounts: state.filterCounts,
    loading: state.loading,
    error: state.error,
    getFilterValueCount,
    isFilterValueDisabled,
    enhanceFiltersWithCounts,
    refetch: fetchFilterCounts
  };
};
