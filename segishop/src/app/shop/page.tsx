'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { ProductGrid } from '@/components/Shop/ProductGrid';
import { FilterSidebar } from '@/components/Shop/FilterSidebar';
import { SortDropdown } from '@/components/Shop/SortDropdown';
import { FilterToggle } from '@/components/Shop/FilterToggle';
import { MobileFilterModal } from '@/components/Shop/MobileFilterModal';
import { Filter, SlidersHorizontal, Grid, List, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

// Types for filtering system
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory?: string;
  description: string;
  inStock: boolean;
  stockCount: number;
  colors?: string[];
  sizes?: string[];
  rating: number;
  reviewCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  createdAt?: string | Date;
  dateCreated?: string | Date;
  slug?: string;
  stock?: number;
  categoryConfigurationType?: 'Regular' | 'SmallBulk' | 'VarietyBox';
  hasActiveConfigurations?: boolean;
}

export interface FilterState {
  priceRange: [number, number];
  colors: string[];
  sizes: string[];
  categories: string[];
  inStockOnly: boolean;
  showOutOfStock: boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' }
];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate actual price range from products
  const actualPriceRange = {
    min: products.length > 0 ? Math.min(...products.map(p => p.price)) : 0,
    max: products.length > 0 ? Math.max(...products.map(p => p.price)) : 1000
  };

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000], // Default range, will be updated when products load
    colors: [],
    sizes: [],
    categories: [],
    inStockOnly: false,
    showOutOfStock: true
  });
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.searchProducts({ pageSize: 100 }); // Fetch 100 products for now
        
        if (response.success && response.products) {
          const mappedProducts: Product[] = response.products.map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            price: p.price,
            originalPrice: p.salePrice || undefined,
            image: p.imageUrl || '/api/placeholder/300/300', // Fallback image
            category: p.categoryName || 'Uncategorized',
            description: p.description || '',
            inStock: p.stock > 0,
            stockCount: p.stock,
            rating: 0, // Default as API doesn't provide yet
            reviewCount: 0,
            isFeatured: p.isFeatured,
            slug: p.slug,
            categoryConfigurationType: p.categoryConfigurationType,
            hasActiveConfigurations: p.hasActiveConfigurations,
            colors: [], // API doesn't provide yet
            sizes: []   // API doesn't provide yet
          }));
          
          setProducts(mappedProducts);
          setFilteredProducts(mappedProducts);
          
          // Update price range based on fetched products
          const minPrice = mappedProducts.length > 0 ? Math.min(...mappedProducts.map(p => p.price)) : 0;
          const maxPrice = mappedProducts.length > 0 ? Math.max(...mappedProducts.map(p => p.price)) : 1000;
          
          setFilters(prev => ({
            ...prev,
            priceRange: [minPrice, maxPrice]
          }));
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('An error occurred while loading products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Filter by colors
    if (filters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors && product.colors.some(color => filters.colors.includes(color))
      );
    }

    // Filter by sizes
    if (filters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes && product.sizes.some(size => filters.sizes.includes(size))
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    // Filter by stock availability
    if (filters.inStockOnly) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Toggle out-of-stock products
    if (!filters.showOutOfStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'popularity':
          return b.reviewCount - a.reviewCount;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, filters, sortBy]);



  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 1000],


      colors: [],
      sizes: [],
      categories: [],
      inStockOnly: false,
      showOutOfStock: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop All Products</h1>
          <p className="text-gray-600">
            Discover our collection of organic snacks and handmade goods
          </p>
        </div>

        {/* Filters and Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearAll={clearAllFilters}
              products={products}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </button>

                {/* Results Count */}
                <span className="text-sm text-gray-600">
                  {filteredProducts.length} of {products.length} products
                </span>

                {/* Out-of-Stock Toggle */}
                <FilterToggle
                  showOutOfStock={filters.showOutOfStock}
                  onChange={(showOutOfStock) => handleFilterChange({ showOutOfStock })}
                />
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <SortDropdown
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  options={sortOptions}
                />

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                {error}
              </div>
            ) : (
              <ProductGrid
                products={filteredProducts}
                viewMode={viewMode}
              />
            )}
          </div>
        </div>

        {/* Mobile Filter Modal */}
        <MobileFilterModal
          isOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          products={products}
        />
      </main>

      <Footer />
    </div>
  );
}

