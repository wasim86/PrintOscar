'use client';

import React, { useState, useMemo } from 'react';
import { FilterState, Product } from '@/app/shop/page';
import { ChevronDown, ChevronUp, X, DollarSign, Palette, Ruler, Package } from 'lucide-react';
import './shop.css';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearAll: () => void;
  products: Product[];
}

interface FilterSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  icon, 
  children, 
  defaultOpen = true 
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 mb-3 hover:text-orange-600 transition-colors"
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2">{title}</span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
};

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onClearAll,
  products
}) => {
  // Extract unique values from products
  const allColors = Array.from(new Set(
    products.flatMap(p => p.colors || [])
  )).sort();

  const allSizes = Array.from(new Set(
    products.flatMap(p => p.sizes || [])
  )).sort();

  const allCategories = Array.from(new Set(
    products.map(p => p.category)
  )).sort();

  const priceRange = {
    min: Math.min(...products.map(p => p.price)),
    max: Math.max(...products.map(p => p.price))
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFilterChange({ priceRange: [min, max] });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onFilterChange({ colors: newColors });
  };

  const handleSizeToggle = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter(s => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ sizes: newSizes });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ categories: newCategories });
  };

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const counts: Record<string, Record<string, number>> = {
      categories: {},
      colors: {},
      sizes: {},
      stock: {}
    };

    // For each filter type, calculate how many products would match if that filter were applied
    const calculateCountsForFilter = (filterType: string, filterValue: string) => {
      // Create test filters that exclude the current filter type
      const testFilters = { ...filters };

      switch (filterType) {
        case 'categories':
          testFilters.categories = [filterValue];
          break;
        case 'colors':
          testFilters.colors = [filterValue];
          break;
        case 'sizes':
          testFilters.sizes = [filterValue];
          break;
        case 'stock':
          testFilters.inStockOnly = filterValue === 'in-stock';
          testFilters.showOutOfStock = filterValue === 'out-of-stock';
          break;
      }

      // Apply all other current filters except the one we're testing
      let filteredProducts = [...products];

      // Apply price range
      filteredProducts = filteredProducts.filter(product =>
        product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
      );

      // Apply other filters (excluding the one we're testing)
      if (filterType !== 'colors' && filters.colors.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.colors && product.colors.some(color => filters.colors.includes(color))
        );
      }

      if (filterType !== 'sizes' && filters.sizes.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.sizes && product.sizes.some(size => filters.sizes.includes(size))
        );
      }

      if (filterType !== 'categories' && filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          filters.categories.includes(product.category)
        );
      }

      if (filterType !== 'stock') {
        if (filters.inStockOnly) {
          filteredProducts = filteredProducts.filter(product => product.inStock);
        }
        if (!filters.showOutOfStock) {
          filteredProducts = filteredProducts.filter(product => product.inStock);
        }
      }

      // Now apply the test filter
      switch (filterType) {
        case 'categories':
          return filteredProducts.filter(product => product.category === filterValue).length;
        case 'colors':
          return filteredProducts.filter(product =>
            product.colors && product.colors.includes(filterValue)
          ).length;
        case 'sizes':
          return filteredProducts.filter(product =>
            product.sizes && product.sizes.includes(filterValue)
          ).length;
        case 'stock':
          if (filterValue === 'in-stock') {
            return filteredProducts.filter(product => product.inStock).length;
          } else {
            return filteredProducts.filter(product => !product.inStock).length;
          }
        default:
          return 0;
      }
    };

    // Calculate counts for each filter option
    allCategories.forEach(category => {
      counts.categories[category] = calculateCountsForFilter('categories', category);
    });

    allColors.forEach(color => {
      counts.colors[color] = calculateCountsForFilter('colors', color);
    });

    allSizes.forEach(size => {
      counts.sizes[size] = calculateCountsForFilter('sizes', size);
    });

    counts.stock['in-stock'] = calculateCountsForFilter('stock', 'in-stock');
    counts.stock['out-of-stock'] = calculateCountsForFilter('stock', 'out-of-stock');

    return counts;
  }, [products, filters, allCategories, allColors, allSizes]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.colors.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.categories.length > 0) count++;
    if (filters.inStockOnly) count++;
    if (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) count++;
    return count;
  };

  const colorMap: Record<string, string> = {
    'Natural': '#F5F5DC',
    'Black': '#000000',
    'Navy': '#000080',
    'Forest Green': '#228B22',
    'Blue': '#0066CC',
    'Green': '#00AA00',
    'Brown': '#8B4513',
    'White': '#FFFFFF',
    'Dark Brown': '#654321'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={onClearAll}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear All ({getActiveFilterCount()})
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <FilterSection
        title="Price Range"
        icon={<DollarSign className="h-4 w-4 text-gray-400" />}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Min</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Max</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
                  className="w-full pl-6 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* Radio Button Price Ranges */}
          <div className="price-range-container py-2">
            <div className="space-y-1">
              {[
                { label: 'All Prices', min: priceRange.min, max: priceRange.max },
                { label: 'Under $15', min: priceRange.min, max: 15 },
                { label: '$15 - $25', min: 15, max: 25 },
                { label: '$25 - $35', min: 25, max: 35 },
                { label: '$35 & Above', min: 35, max: priceRange.max }
              ].map((range) => {
                const isSelected = filters.priceRange[0] === range.min && filters.priceRange[1] === range.max;
                const productCount = products.filter(p => p.price >= range.min && p.price <= range.max).length;

                return (
                  <label
                    key={`${range.min}-${range.max}`}
                    className="price-range-label flex items-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePriceRangeChange(range.min, range.max);
                    }}
                  >
                    <input
                      type="radio"
                      name="priceRange"
                      checked={isSelected}
                      onChange={() => {}} // Handled by label click
                      className="price-range-radio h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <span className="ml-3 text-sm text-gray-700 font-medium select-none">{range.label}</span>
                    <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {productCount}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center bg-orange-50 rounded-lg p-3">
            <span className="text-sm font-medium text-orange-800">
              Selected Range:
            </span>
            <span className="text-sm font-bold text-orange-900">
              ${filters.priceRange[0].toFixed(2)} - ${filters.priceRange[1].toFixed(2)}
            </span>
          </div>
        </div>
      </FilterSection>

      {/* Category Filter */}
      <FilterSection
        title="Categories"
        icon={<Package className="h-4 w-4 text-gray-400" />}
      >
        <div className="space-y-2">
          {allCategories.map(category => {
            const count = filterCounts.categories[category] || 0;
            const isDisabled = count === 0 && !filters.categories.includes(category);

            return (
              <label key={category} className={`flex items-center ${
                isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}>
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  disabled={isDisabled}
                  onChange={() => handleCategoryToggle(category)}
                  className={`h-4 w-4 focus:ring-2 border-gray-300 rounded ${
                    isDisabled
                      ? 'text-gray-400 focus:ring-gray-300'
                      : 'text-orange-600 focus:ring-orange-500'
                  }`}
                />
                <span className={`ml-3 text-sm ${
                  isDisabled ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}>
                  {category}
                </span>
                <span className={`ml-auto text-xs font-medium ${
                  isDisabled ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      {/* Color Filter */}
      {allColors.length > 0 && (
        <FilterSection
          title="Colors"
          icon={<Palette className="h-4 w-4 text-gray-400" />}
        >
          <div className="grid grid-cols-1 gap-2">
            {allColors.map(color => {
              const count = filterCounts.colors[color] || 0;
              const isDisabled = count === 0 && !filters.colors.includes(color);

              return (
                <label key={color} className={`flex items-center justify-between ${
                  isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color)}
                      disabled={isDisabled}
                      onChange={() => handleColorToggle(color)}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-2 ${
                          filters.colors.includes(color)
                            ? 'border-orange-500 ring-2 ring-orange-200'
                            : isDisabled
                            ? 'border-gray-300 opacity-50'
                            : 'border-gray-300'
                        }`}
                        style={{
                          backgroundColor: colorMap[color] || '#CCCCCC',
                          border: color === 'White' ? '2px solid #E5E7EB' : undefined
                        }}
                      />
                      <span className={`text-sm ${
                        isDisabled ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}>
                        {color}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-medium ${
                    isDisabled ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Size Filter */}
      {allSizes.length > 0 && (
        <FilterSection
          title="Sizes"
          icon={<Ruler className="h-4 w-4 text-gray-400" />}
        >
          <div className="space-y-2">
            {allSizes.map(size => {
              const count = filterCounts.sizes[size] || 0;
              const isDisabled = count === 0 && !filters.sizes.includes(size);

              return (
                <label key={size} className={`flex items-center ${
                  isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}>
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    disabled={isDisabled}
                    onChange={() => handleSizeToggle(size)}
                    className={`h-4 w-4 focus:ring-2 border-gray-300 rounded ${
                      isDisabled
                        ? 'text-gray-400 focus:ring-gray-300'
                        : 'text-orange-600 focus:ring-orange-500'
                    }`}
                  />
                  <span className={`ml-3 text-sm ${
                    isDisabled ? 'text-gray-400 line-through' : 'text-gray-700'
                  }`}>
                    {size}
                  </span>
                  <span className={`ml-auto text-xs font-medium ${
                    isDisabled ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </FilterSection>
      )}

      {/* Availability Filter */}
      <FilterSection
        title="Availability"
        icon={<Package className="h-4 w-4 text-gray-400" />}
      >
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">In Stock Only</span>
            <span className="ml-auto text-xs font-medium text-gray-500">
              ({filterCounts.stock['in-stock'] || 0})
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={!filters.showOutOfStock}
              onChange={(e) => onFilterChange({ showOutOfStock: !e.target.checked })}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <span className="ml-3 text-sm text-gray-700">Hide Out of Stock</span>
            <span className="ml-auto text-xs font-medium text-gray-500">
              ({filterCounts.stock['out-of-stock'] || 0} hidden)
            </span>
          </label>
        </div>
      </FilterSection>
    </div>
  );
};
