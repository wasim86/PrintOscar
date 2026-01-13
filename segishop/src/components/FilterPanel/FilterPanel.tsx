'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { FilterOption, FilterOptionValue } from '@/types/api';
import { API_BASE_URL } from '@/services/config';
import { filtersApi } from '@/services/api';
import { useFilterCounts, FilterOptionWithCounts } from '@/hooks/useFilterCounts';

interface FilterPanelProps {
  categoryId?: number;
  onFiltersChange: (filters: Record<string, string[]>) => void;
  appliedFilters: Record<string, string[]>;
  className?: string;
  products?: any[]; // For fallback filter count calculation
}

interface FilterState {
  [filterId: string]: string[];
}

const FilterPanelComponent: React.FC<FilterPanelProps> = ({
  categoryId,
  onFiltersChange,
  appliedFilters,
  className = "",
  products = [],
}) => {
  const [filters, setFilters] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState<Set<number>>(new Set());
  const [localFilters, setLocalFilters] = useState<FilterState>({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use filter counts hook
  const {
    filterCounts,
    loading: countsLoading,
    getFilterValueCount,
    isFilterValueDisabled,
    enhanceFiltersWithCounts
  } = useFilterCounts({
    categoryId,
    appliedFilters,
    products
  });

  // Load filters when category changes
  useEffect(() => {
    const loadFilters = async () => {
      if (!categoryId) {
        setFilters([]);
        return;
      }

      try {
        setLoading(true);
        const response = await filtersApi.getFiltersByCategory(categoryId);

        if (response.success && response.filters) {
          setFilters(response.filters);
          // Auto-expand first 3 filters
          const autoExpand = new Set<number>(response.filters.slice(0, 3).map((f: FilterOption) => f.id));
          setExpandedFilters(autoExpand);
        } else {
          setFilters([]);
        }
      } catch (error) {
        console.error('Error loading filters:', error);
        setFilters([]);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, [categoryId]);

  // Prefer numeric price from product fields; tolerate strings like "$5.25"
  const normalizePriceValue = (v: any): number | null => {
    if (v == null) return null;
    if (typeof v === 'number') return !isNaN(v) && v > 0 ? v : null;
    const cleaned = String(v).replace(/[^0-9.]/g, '');
    const n = parseFloat(cleaned);
    return !isNaN(n) && n > 0 ? n : null;
  };

  const productIsInStock = (p: any): boolean => {
    if (p?.inStock === true) return true;
    const nums = [p?.stock, p?.stockCount];
    return nums.some((n) => typeof n === 'number' && !isNaN(n) && n > 0);
  };

  // Compute stable price stats from current products (only in-stock)
  const priceStats = React.useMemo(() => {
    const list = (products as any[] || []).filter(productIsInStock);
    const prices: number[] = [];
    for (const p of list) {
      const candidates = [p.calculatedPrice, p.price, p.salePrice, p.originalPrice];
      for (const c of candidates) {
        const n = normalizePriceValue(c);
        if (n !== null) { prices.push(n); break; }
      }
    }
    if (prices.length === 0) return null;
    const min = Math.floor(Math.min(...prices));
    const maxRaw = Math.max(...prices);
    const max = Math.max(min + 1, Math.ceil(maxRaw));
    return { min, max };
  }, [products, categoryId]);

  // Fetch server-side category price range across all pages
  const [remotePriceStats, setRemotePriceStats] = useState<{ min: number; max: number } | null>(null);
  useEffect(() => {
    // Build query to compute price range across full filtered set on the server
    if (!categoryId) { setRemotePriceStats(null); return; }
    const params = new URLSearchParams();
    params.set('page', '1');
    params.set('pageSize', '1'); // minimal payload
    params.set('categoryId', String(categoryId));
    params.set('inStock', 'true');
    // Include StockStatus filter if present
    const stock = appliedFilters['StockStatus'];
    if (stock && stock.length) {
      for (const v of stock) {
        params.append('filters[StockStatus]', v);
      }
    }
    // Include Price filter if present (to reflect narrowed range when price is already set)
    const price = appliedFilters['Price'];
    if (price && price.length) {
      for (const v of price) {
        params.append('filters[Price]', v);
      }
    }
    const url = `${API_BASE_URL}/products/search?${params.toString()}`;
    fetch(url, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(data => {
        if (data && data.success && data.priceRange) {
          const min = Number(data.priceRange.min);
          const max = Number(data.priceRange.max);
          if (!isNaN(min) && !isNaN(max) && max > min) setRemotePriceStats({ min, max });
        }
      })
      .catch(() => setRemotePriceStats(null));
  }, [categoryId, appliedFilters]);

  // Initialize local filters from applied filters
  useEffect(() => {
    setLocalFilters(appliedFilters);
  }, [appliedFilters]);

  // When products or category changes, ensure price range clamps to the new bounds
  useEffect(() => {
    if (!filters.length) return;
    const priceFilter = filters.find(f => f.filterType.toLowerCase() === 'range' && (f.name.toLowerCase() === 'price' || f.displayName.toLowerCase().includes('price')));
    if (!priceFilter) return;

    const fallbackMin = priceFilter.minValue ?? 0;
    const fallbackMax = priceFilter.maxValue ?? 1000;
    const sourceRange: { min: number; max: number } | null = (remotePriceStats ?? priceStats) as { min: number; max: number } | null;
    const minValue = (sourceRange && typeof sourceRange.min === 'number') ? sourceRange.min : fallbackMin;
    const maxValue = (sourceRange && typeof sourceRange.max === 'number') ? sourceRange.max : Math.max(minValue + 1, fallbackMax);

    const currentRange = localFilters[priceFilter.name];
    if (currentRange && currentRange[0]) {
      const [currentMin, currentMax] = currentRange[0].split('-').map(Number);
      const clampedMin = Math.max(minValue, Math.min(currentMin || minValue, maxValue - 1));
      const clampedMax = Math.min(maxValue, Math.max(currentMax || maxValue, (clampedMin || minValue) + 1));
      // Only update if values actually changed; do NOT add a price filter when none exists
      if (`${clampedMin}-${clampedMax}` !== currentRange[0]) {
        setLocalFilters(prev => ({
          ...prev,
          [priceFilter.name]: [`${clampedMin}-${clampedMax}`]
        }));
      }
    }
  }, [categoryId, products, filters, priceStats, remotePriceStats]);

  const toggleFilterExpansion = (filterId: number) => {
    const newExpanded = new Set(expandedFilters);
    if (newExpanded.has(filterId)) {
      newExpanded.delete(filterId);
    } else {
      newExpanded.add(filterId);
    }
    setExpandedFilters(newExpanded);
  };

  const handleFilterValueChange = React.useCallback((filterName: string, value: string, checked: boolean) => {
    const newFilters = { ...localFilters };

    if (!newFilters[filterName]) {
      newFilters[filterName] = [];
    }

    if (checked) {
      if (!newFilters[filterName].includes(value)) {
        newFilters[filterName] = [...newFilters[filterName], value];
      }
    } else {
      newFilters[filterName] = newFilters[filterName].filter(v => v !== value);
      if (newFilters[filterName].length === 0) {
        delete newFilters[filterName];
      }
    }

    setLocalFilters(newFilters);

    // Use startTransition for better performance
    React.startTransition(() => {
      onFiltersChange(newFilters);
    });
  }, [localFilters, onFiltersChange]);

  const handleRangeFilterChange = (filterName: string, minValue: number, maxValue: number) => {
    const newFilters = { ...localFilters };
    newFilters[filterName] = [`${minValue}-${maxValue}`];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilter = (filterName: string) => {
    const newFilters = { ...localFilters };
    delete newFilters[filterName];
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    return Object.keys(localFilters).length;
  };

  const renderFilterValues = (filter: FilterOption) => {
    const filterType = filter.filterType.toLowerCase();

    // Special handling for stock status - render with stock icons
    if (filter.name.toLowerCase() === 'stockstatus') {
      const stockOptions = [
        { value: 'InStock', displayValue: 'In Stock', icon: '✅', color: 'text-green-600' },
        { value: 'OutOfStock', displayValue: 'Out of Stock', icon: '❌', color: 'text-red-600' }
      ];

      return (
        <div className="space-y-3">
          {stockOptions.map((option) => {
            const count = getFilterValueCount('StockStatus', option.value.toLowerCase());
            const isDisabled = isFilterValueDisabled('StockStatus', option.value.toLowerCase());
            const isChecked = localFilters[filter.name]?.includes(option.value) || false;

            return (
              <label key={option.value} className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                isDisabled && !isChecked
                  ? 'cursor-not-allowed opacity-60'
                  : 'cursor-pointer group hover:bg-gray-50'
              }`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    disabled={isDisabled && !isChecked}
                    onChange={(e) => handleFilterValueChange(filter.name, option.value, e.target.checked)}
                    className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                      isDisabled && !isChecked
                        ? 'text-gray-400 focus:ring-gray-300'
                        : 'text-orange-600 focus:ring-orange-500'
                    }`}
                  />
                </div>
                <div className="flex items-center space-x-2 flex-1">
                  <span className={`text-lg ${option.color}`}>{option.icon}</span>
                  <span className={`text-sm transition-colors ${
                    isDisabled && !isChecked
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700 group-hover:text-gray-900'
                  }`}>
                    {option.displayValue}
                  </span>
                  <span className={`text-xs font-medium ml-auto ${
                    isDisabled && !isChecked
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}>
                    ({count})
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      );
    }

    if (filterType === 'range') {
      // Derive dynamic min/max for price filters based on current category products
      const isPriceFilter = filter.name.toLowerCase() === 'price' || filter.displayName.toLowerCase().includes('price');
      const fallbackMin = filter.minValue || 0;
      const fallbackMax = filter.maxValue || 1000;
      const sourceRange2: { min: number; max: number } | null = (remotePriceStats ?? priceStats) as any;
      let minValue = (isPriceFilter && sourceRange2) ? sourceRange2.min : fallbackMin;
      let maxValue = (isPriceFilter && sourceRange2) ? sourceRange2.max : Math.max(minValue + 1, fallbackMax);

      // Get current price range from filters or use defaults
      const currentRange = localFilters[filter.name] || [`${minValue}-${maxValue}`];
      const [currentMin, currentMax] = currentRange[0]?.split('-').map(Number) || [minValue, maxValue];

      const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMin = Math.max(minValue, Math.min(Number(e.target.value) || minValue, currentMax - 1));
        handleRangeFilterChange(filter.name, newMin, currentMax);
      };

      const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newMax = Math.min(maxValue, Math.max(Number(e.target.value) || maxValue, currentMin + 1));
        handleRangeFilterChange(filter.name, currentMin, newMax);
      };

      return (
        <div className="space-y-4">
          {/* Price Range Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Min Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={minValue}
                  max={currentMax - 1}
                  value={currentMin}
                  onChange={handleMinInputChange}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Max Price</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={currentMin + 1}
                  max={maxValue}
                  value={currentMax}
                  onChange={handleMaxInputChange}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Visual Range Bar */}
          <div className="relative px-1">
            <div className="h-3 bg-gray-200 rounded-full">
              <div
                className="h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full shadow-sm"
                style={{
                  marginLeft: `${((currentMin - minValue) / (maxValue - minValue)) * 100}%`,
                  width: `${((currentMax - currentMin) / (maxValue - minValue)) * 100}%`
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span className="font-medium">${minValue}</span>
              <span className="font-medium">${maxValue}</span>
            </div>
          </div>

          {/* Clear Price Button */}
          {(currentMin !== minValue || currentMax !== maxValue) && (
            <div className="pt-2">
              <button
                onClick={() => handleRangeFilterChange(filter.name, minValue, maxValue)}
                className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
              >
                Clear Price
              </button>
            </div>
          )}
        </div>
      );
    }

    // Remove duplicates based on value.id
    const uniqueValues = filter.filterOptionValues.filter((value, index, self) =>
      index === self.findIndex(v => v.id === value.id)
    );

    return (
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {uniqueValues.map((value: FilterOptionValue) => {
          const isDisabled = isFilterValueDisabled(filter.name, value.value);
          const isChecked = localFilters[filter.name]?.includes(value.value) || false;

          return (
            <label key={value.id} className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isDisabled && !isChecked
                ? 'cursor-not-allowed opacity-60'
                : 'cursor-pointer group hover:bg-gray-50'
            }`}>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isChecked}
                  disabled={isDisabled && !isChecked}
                  onChange={(e) => handleFilterValueChange(filter.name, value.value, e.target.checked)}
                  className={`w-4 h-4 border-gray-300 rounded focus:ring-2 ${
                    isDisabled && !isChecked
                      ? 'text-gray-400 focus:ring-gray-300'
                      : 'text-orange-600 focus:ring-orange-500'
                  }`}
                />
              </div>
            <div className="flex items-center space-x-2 flex-1">
              {value.colorCode && (
                <div
                  className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm"
                  style={{ backgroundColor: value.colorCode }}
                  title={`Color: ${value.colorCode}`}
                />
              )}
              <span className={`text-sm transition-colors ${
                isFilterValueDisabled(filter.name, value.value)
                  ? 'text-gray-400 line-through'
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {value.displayValue}
              </span>
              <span className={`text-xs font-medium ml-auto ${
                isFilterValueDisabled(filter.name, value.value)
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}>
                ({getFilterValueCount(filter.name, value.value)})
              </span>
              {value.description && (
                <span className="text-xs text-gray-500 italic">({value.description})</span>
              )}
            </div>
          </label>
        );
        })}
      </div>
    );
  };

  // Remove loading state for filter panel - loading will be handled by parent component based on product count
  // if (loading) {
  //   return (
  //     <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
  //       <div className="animate-pulse space-y-4">
  //         <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  //         <div className="space-y-2">
  //           <div className="h-3 bg-gray-200 rounded"></div>
  //           <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  if (!categoryId || !filters.length) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
        <div className="text-center text-gray-500">
          <div className="mb-2">
            <Filter className="h-8 w-8 mx-auto text-gray-300" />
          </div>
          <p className="text-sm">
            {!categoryId ? 'Select a category to see filters' : 'No filters available for this category'}
          </p>
          {loading && (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-xs mt-1">Loading filters...</p>
            </div>
          )}
          {!loading && categoryId && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Debug Info:</strong><br/>
                Category ID: {categoryId}<br/>
                Filters loaded: {filters.length}<br/>
                Products available: {products?.length || 0}
              </p>
              {products?.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  <strong>Sample product:</strong><br/>
                  {products[0]?.name} - {products[0]?.categoryName}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {getActiveFilterCount() > 0 && (
            <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs">
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>

      {/* Desktop Filter Panel */}
      <div className={`hidden lg:block bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              {getActiveFilterCount() > 0 && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getActiveFilterCount()} active
                </span>
              )}
            </div>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {filters.map((filter) => (
            <div key={filter.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-sm transition-shadow">
              <button
                onClick={() => toggleFilterExpansion(filter.id)}
                className="flex items-center justify-between w-full text-left p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{filter.displayName}</span>
                  {localFilters[filter.name] && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {localFilters[filter.name].length}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {expandedFilters.has(filter.id) ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>

              {expandedFilters.has(filter.id) && (
                <div className="px-3 pb-3 bg-gray-50">
                  <div className="pt-2">
                    {renderFilterValues(filter)}
                  </div>
                  {localFilters[filter.name] && (
                    <button
                      onClick={() => clearFilter(filter.name)}
                      className="mt-3 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-all duration-200"
                    >
                      Clear {filter.displayName}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileFilters(false)}
            aria-hidden="true"
          />
          {/* Modal Content */}
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl z-10">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto h-full pb-20">
              {filters.map((filter) => (
                <div key={filter.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                  <button
                    onClick={() => toggleFilterExpansion(filter.id)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{filter.displayName}</span>
                      {localFilters[filter.name] && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          {localFilters[filter.name].length}
                        </span>
                      )}
                    </div>
                    {expandedFilters.has(filter.id) ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>

                  {expandedFilters.has(filter.id) && (
                    <div className="mt-3">
                      {renderFilterValues(filter)}
                      {localFilters[filter.name] && (
                        <button
                          onClick={() => clearFilter(filter.name)}
                          className="mt-2 text-xs text-red-600 hover:text-red-800 transition-colors"
                        >
                          Clear {filter.displayName}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={clearAllFilters}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Export without memoization to ensure price range updates immediately with product changes
export const FilterPanel = FilterPanelComponent;
