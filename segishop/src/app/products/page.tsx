'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header/Header';
import { Footer } from '@/components/Footer/Footer';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { Cart } from '@/components/Cart/Cart';
import { Loader2, AlertCircle, RefreshCw, ShoppingCart, Heart, Eye, Grid3X3, List, Search, ArrowUp, Settings, Zap, Scale } from 'lucide-react';
import { Pagination } from '@/components/Pagination/Pagination';
import { ProductCount } from '@/components/ProductCount/ProductCount';
import { ProductsPerPage } from '@/components/ProductsPerPage/ProductsPerPage';
import { PriceDisplay } from '@/components/Currency/PriceDisplay';
import { useProducts } from '@/hooks/useProducts';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { QuickViewModal } from '@/components/Product/QuickViewModal';
import { DEFAULT_PRODUCT_IMAGE } from '@/services/config';

// Configuration type detection based on category configuration
const getConfigurationType = (product: any): 'Regular' | 'SmallBulk' | 'VarietyBox' => {
  // If product has category configuration type, use it
  if (product.categoryConfigurationType) {
    return product.categoryConfigurationType;
  }

  // Fallback to category name-based detection for backward compatibility
  const categoryLower = product.category?.toLowerCase() || '';

  if (categoryLower.includes('variety') || categoryLower.includes('box')) {
    return 'VarietyBox';
  } else if (categoryLower.includes('bulk')) {
    return 'SmallBulk';
  } else {
    // Default to Regular for snacks and other categories
    return 'Regular';
  }
};

// Check if product has configurations
const hasProductConfigurations = (product: any): boolean => {
  // Use the new hasActiveConfigurations field from API, with fallback to old logic
  if (product.hasActiveConfigurations !== undefined) {
    return product.hasActiveConfigurations;
  }

  // Fallback to old logic for backward compatibility
  const configurationType = getConfigurationType(product);
  return configurationType !== 'Regular';
};

// Helper function to determine product labels
const getProductLabels = (product: any) => {
  const labels = [];

  // Featured label
  if (product.isFeatured) {
    labels.push({
      text: 'Featured',
      className: 'bg-orange-500 text-white'
    });
  }

  // Low Stock label (stock <= 10)
  const stock = product.stock || product.stockCount || 0;
  if (stock > 0 && stock <= 10) {
    labels.push({
      text: 'Low Stock',
      className: 'bg-red-500 text-white'
    });
  }

  // New Product label (created within last 30 days)
  if (product.createdAt || product.dateCreated) {
    const createdDate = new Date(product.createdAt || product.dateCreated);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    if (createdDate > thirtyDaysAgo) {
      labels.push({
        text: 'New',
        className: 'bg-green-500 text-white'
      });
    }
  }

  return labels;
};

// Flatten categories with subcategories for dropdown display
const flattenCategoriesForDropdown = (categories: any[], level: number = 0): Array<{
  productCount: any;id: string, name: string, level: number
}> => {
  const flattened: Array<{id: string, name: string, level: number}> = [];

  categories.forEach(category => {
    // Add the current category
    flattened.push({
      id: category.id,
      name: category.name,
      level: level
    });

    // Add subcategories recursively
    if (category.children && category.children.length > 0) {
      flattened.push(...flattenCategoriesForDropdown(category.children, level + 1));
    }
  });

  return flattened.map(cat => ({
    ...cat,
    productCount: 0 // add default productCount to satisfy type
  }));
};


const findCategoryById = (categories: any[], id: number | string): any | null => {
  const targetId = id?.toString();
  for (const category of categories) {
    if (category.id?.toString() === targetId) return category;
    if (category.children && category.children.length > 0) {
      const found = findCategoryById(category.children, targetId || '');
      if (found) return found;
    }
  }
  return null;
};

// Memoized Product Card Component for better performance
const ProductCard = React.memo(({ product, viewMode, onQuickView }: {
  product: any;
  viewMode: 'grid' | 'list';
  onQuickView: (product: any) => void;
}) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison, canAddToComparison } = useComparison();
  const isInStock = (product.stock || product.stockCount || 0) > 0;
  const productIdNum = parseInt(product.id);
  const isWishlisted = isInWishlist(productIdNum);

  // Determine configuration type based on category configuration
  const configurationType = getConfigurationType(product);
  const getCategoryFallback = () => {
    return DEFAULT_PRODUCT_IMAGE;
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isInStock) {
      alert('This product is out of stock');
      return;
    }

    // For SmallBulk products, add with default bulk quantity (minimum bulk quantity)
    const productAttributes = configurationType === 'SmallBulk'
      ? JSON.stringify({
          configurationType: 'SmallBulk',
          bulkQuantity: 24 // Default minimum bulk quantity
        })
      : undefined;

    const success = await addToCart({
      productId: product.id,
      quantity: 1,
      productAttributes
    });

    if (success) {
      // Cart panel will open automatically via context
    } else {
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      alert('Please login to add items to wishlist');
      return;
    }

    // If already wishlisted, remove from wishlist instead
    if (isWishlisted) {
      const success = await removeFromWishlist(productIdNum);
      if (success) {
        console.log('Removed from wishlist successfully');
      } else {
        alert('Failed to remove item from wishlist. Please try again.');
      }
      return;
    }

    const success = await addToWishlist(productIdNum);
    if (success) {
      console.log('Added to wishlist successfully');
    } else {
      alert('Failed to add item to wishlist. Please try again.');
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  const isCompared = isInComparison(String(product.id));
  const handleCompare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromComparison(String(product.id));
      return;
    }
    if (!canAddToComparison) {
      alert('You can compare up to 4 products at a time.');
      return;
    }
    addToComparison({ id: String(product.id), title: product.title, price: product.price, image: product.image || product.imageUrl, slug: product.slug });
  };
  
  return (
    <div
      className={`group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      {/* Product Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
        <Link href={`/products/${product.slug || product.id}`} prefetch={false}>
          <img
            src={product.image || getCategoryFallback()}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            loading="lazy"
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              target.src = getCategoryFallback();
              target.onerror = null;
            }}
          />
        </Link>

        {/* Product Labels */}
        {(() => {
          const labels = getProductLabels(product);
          if (labels.length === 0) return null;

          return (
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {labels.map((label, index) => (
                <div
                  key={index}
                  className={`${label.className} px-2 py-1 rounded-full text-xs font-medium shadow-sm`}
                >
                  {label.text}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Quick View Button */}
        <button
          onClick={handleQuickView}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-80 rounded-full shadow-lg hover:bg-opacity-100 transition-all opacity-0 group-hover:opacity-100"
          title="Quick View"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </button>
      </div>

      {/* Product Info */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <Link href={`/products/${product.slug || product.id}`} prefetch={false}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-orange-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <PriceDisplay
            price={product.price || 0}
            originalPrice={product.originalPrice}
            salePrice={product.salePrice}
            size="md"
            className="flex-1"
          />
          <span className={`text-xs px-2 py-1 rounded-full ${
            isInStock
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {isInStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isInStock ? (
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-center text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4 inline mr-1" />
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed text-center text-sm font-medium"
            >
              <ShoppingCart className="h-4 w-4 inline mr-1" />
              Out of Stock
            </button>
          )}
          <button
            onClick={handleAddToWishlist}
            className={`p-2 border rounded-lg transition-colors ${
              isWishlisted
                ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100'
                : 'border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-red-500'
            }`}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleCompare}
            className={`p-2 border rounded-lg transition-colors ${
              isCompared
                ? 'border-blue-500 bg-blue-50 text-blue-600 hover:bg-blue-100'
                : 'border-gray-300 hover:bg-gray-50 text-gray-600 hover:text-blue-600'
            }`}
            title={isCompared ? 'Remove from compare' : 'Add to compare'}
          >
            <Scale className="h-4 w-4" />
          </button>
          {/* Quick View button removed here to reduce clutter; top-right hover Quick View remains */}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Component to handle search params with Suspense
function SearchParamsHandler({ onParamsChange }: { onParamsChange: (params: { search?: string; category?: string }) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryParam = searchParams?.get('category');
    const searchParam = searchParams?.get('search');

    onParamsChange({
      search: searchParam || undefined,
      category: categoryParam || undefined
    });
  }, [searchParams, onParamsChange]);

  return null;
}

function ProductsPageContent() {
  // State for URL parameters
  const [urlParams, setUrlParams] = useState<{ search?: string; category?: string }>({});

  // Use the basic products hook
  const {
    products,
    categories,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage: hookCurrentPage,
    hasNextPage,
    hasPreviousPage,
    searchProducts,
    clearError,
  } = useProducts();

  // View mode and UI state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string[]>>({});
  const [sortOption, setSortOption] = useState<string>('latest');
  const [stockFilter, setStockFilter] = useState<string>('all');

  // Quick View state
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Map URL category slug to numeric category ID when categories are loaded
  useEffect(() => {
    if (!urlParams.category || !categories || categories.length === 0) return;
    const targetSlug = urlParams.category.toLowerCase();

    const findBySlug = (cats: any[]): any | null => {
      for (const c of cats) {
        // Check explicit slug
        if (String(c.slug || c.Slug || '').toLowerCase() === targetSlug) return c;
        
        // Check generated slug (fallback for legacy/hardcoded links)
        const generatedSlug = c.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        if (generatedSlug === targetSlug) return c;

        if (c.children && c.children.length) {
          const found = findBySlug(c.children);
          if (found) return found;
        }
      }
      return null;
    };

    const match = findBySlug(categories);
    if (match && match.id) {
      if (selectedCategory !== match.id) {
        setSelectedCategory(match.id);
      }
    } else {
      // If no match, default to null (All Categories)
      if (selectedCategory !== null) setSelectedCategory(null);
    }
  }, [urlParams.category, categories]);

  // Parse sort option into sortBy, sortOrder, and isFeatured
  const parseSortOption = (option: string) => {
    switch (option) {
      case 'latest':
        return { sortBy: 'created', sortOrder: 'desc', isFeatured: undefined };
      case 'popularity':
        return { sortBy: 'popularity', sortOrder: 'desc', isFeatured: undefined };
      case 'rating':
        return { sortBy: 'rating', sortOrder: 'desc', isFeatured: undefined };
      case 'price-low':
        return { sortBy: 'price', sortOrder: 'asc', isFeatured: undefined };
      case 'price-high':
        return { sortBy: 'price', sortOrder: 'desc', isFeatured: undefined };
      default:
        return { sortBy: 'created', sortOrder: 'desc', isFeatured: undefined }; // Default to latest
    }
  };

  // Parse stock filter into inStock parameter
  const parseStockFilter = (filter: string) => {
    switch (filter) {
      case 'in-stock':
        return true;
      case 'out-of-stock':
        return false;
      case 'all':
      default:
        return undefined;
    }
  };

  // Pagination handlers
  const handlePageChange = React.useCallback((page: number) => {
    const { sortBy, sortOrder, isFeatured } = parseSortOption(sortOption);
    const inStock = parseStockFilter(stockFilter);
    const { StockStatus, ...otherFilters } = appliedFilters;

    searchProducts({
      searchTerm: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
      filters: otherFilters,
      isFeatured: isFeatured,
      inStock: inStock,
      sortBy: sortBy,
      sortOrder: sortOrder,
      page: page,
      pageSize: pageSize,
      append: false // Replace products for pagination
    });

    setCurrentPage(page);

    // Scroll to top of products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [sortOption, stockFilter, appliedFilters, searchTerm, selectedCategory, pageSize, searchProducts]);

  const handlePageSizeChange = React.useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to page 1 when changing page size

    const { sortBy, sortOrder, isFeatured } = parseSortOption(sortOption);
    const inStock = parseStockFilter(stockFilter);
    const { StockStatus, ...otherFilters } = appliedFilters;

    searchProducts({
      searchTerm: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
      filters: otherFilters,
      isFeatured: isFeatured,
      inStock: inStock,
      sortBy: sortBy,
      sortOrder: sortOrder,
      page: 1,
      pageSize: newPageSize,
      append: false
    });
  }, [sortOption, stockFilter, appliedFilters, searchTerm, selectedCategory, searchProducts]);

  // Throttle function for scroll performance
  function throttle(func: Function, delay: number) {
    let timeoutId: NodeJS.Timeout;
    let lastExecTime = 0;
    return function (this: any, ...args: any[]) {
      const currentTime = Date.now();

      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // Throttled scroll handler for scroll to top button only
  const throttledHandleScroll = React.useCallback(
    throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      // Show/hide scroll to top button
      setShowScrollTop(scrollTop > 300);
    }, 200),
    []
  );

  // Scroll functionality for scroll to top button
  React.useEffect(() => {
    window.addEventListener('scroll', throttledHandleScroll);
    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [throttledHandleScroll]);



  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Quick View handlers
  const handleQuickView = (product: any) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  // Handle URL parameter changes
  const handleParamsChange = useCallback((params: { search?: string; category?: string }) => {
    setUrlParams(params);
  }, []);

  // Initialize search from URL parameters
  useEffect(() => {
    setSearchTerm(urlParams.search || '');
  }, [urlParams.search]);



  // Handle search input
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset pagination
    const { sortBy, sortOrder, isFeatured } = parseSortOption(sortOption);
    const inStock = parseStockFilter(stockFilter);
    searchProducts({
      searchTerm: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
      filters: appliedFilters,
      isFeatured: isFeatured,
      inStock: inStock,
      sortBy: sortBy,
      sortOrder: sortOrder,
      page: 1,
      pageSize: pageSize, // Use current page size
      append: false // Replace products for search
    });
  };

  // Initial search with correct page size
  React.useEffect(() => {
    const { sortBy, sortOrder, isFeatured } = parseSortOption(sortOption);
    const inStock = parseStockFilter(stockFilter);

    searchProducts({
      page: 1,
      pageSize: pageSize,
      sortBy: sortBy,
      sortOrder: sortOrder,
      isFeatured: isFeatured,
      inStock: inStock,
      append: false
    });
    setCurrentPage(1);
  }, []); // Only run once on mount

  // Filter products by stock status on frontend (memoized for performance)
  const filterProductsByStock = React.useCallback((products: any[], stockFilters: string[]) => {
    if (!stockFilters || stockFilters.length === 0) {
      return products;
    }

    return products.filter(product => {
      const isInStock = (product.stock || product.stockCount || 0) > 0;

      if (stockFilters.includes('InStock') && stockFilters.includes('OutOfStock')) {
        return true; // Show all products
      } else if (stockFilters.includes('InStock')) {
        return isInStock;
      } else if (stockFilters.includes('OutOfStock')) {
        return !isInStock;
      }

      return true;
    });
  }, []);

  // Auto-trigger search when search term or filters change with optimized debouncing
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset pagination on filter change
      const { sortBy, sortOrder, isFeatured } = parseSortOption(sortOption);
      const inStock = parseStockFilter(stockFilter);

      // Separate stock status filters from other filters
      const { StockStatus, ...otherFilters } = appliedFilters;

      searchProducts({
        searchTerm: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        filters: otherFilters, // Send only non-stock filters to backend
        isFeatured: isFeatured,
        inStock: inStock,
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: 1,
        pageSize: pageSize, // Use current page size
        append: false // Replace products when filters change
      });
      setCurrentPage(1); // Reset to page 1 when filters change
    }, 150); // Reduced debounce time for faster response

    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory, appliedFilters, sortOption, stockFilter, pageSize]);

  // Loading state
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => {
                clearError();
                searchProducts({ page: 1, pageSize: 20 });
              }}
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={null}>
          <SearchParamsHandler onParamsChange={handleParamsChange} />
        </Suspense>
        <Header />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Discover our wide range of quality products</p>
          </div>

          {/* Search and Filters Bar */}
          <div className="mb-6 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                />
              </div>
            </form>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Category Dropdown */}
              <select
                value={selectedCategory || ''}
                onChange={(e) => {
                  const categoryId = e.target.value ? parseInt(e.target.value) : null;
                  // Use startTransition for better performance
                  React.startTransition(() => {
                    setSelectedCategory(categoryId);
                    setAppliedFilters({}); // Clear filters when category changes
                  });
                }}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[180px]"
              >
                <option value="">All Categories</option>
                {flattenCategoriesForDropdown(categories).map((category) => (
                  <option key={category.id} value={category.id}>
                    {/* Add indentation for subcategories */}
                    {'  '.repeat(category.level)}
                    {category.level > 0 ? '└ ' : ''}
                    {category.name}
                  </option>
                ))}
              </select>
              {selectedCategory !== null && (() => {
                const cat = findCategoryById(categories, selectedCategory as any);
                const count = cat?.productCount;
                return typeof count === 'number' ? (
                  <span className="text-sm text-gray-600">{`Products: ${count}`}</span>
                ) : null;
              })()}

              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[200px]"
              >
                <option value="latest">Sort by latest</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
              </select>

              {/* Stock Filter */}
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-w-[140px]"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content with Filters and Products */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter Panel */}
            <div className="lg:w-64 flex-shrink-0">
              <FilterPanel
                categoryId={selectedCategory || undefined}
                onFiltersChange={setAppliedFilters}
                appliedFilters={appliedFilters}
                products={(() => {
                  const stockFilters = appliedFilters.StockStatus || [];
                  return filterProductsByStock(products, stockFilters);
                })()}
              />
            </div>

            {/* Products Section */}
            <div className="flex-1" id="products-section">
              {/* Product Count and Controls */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <ProductCount
                  currentPage={hookCurrentPage}
                  pageSize={pageSize}
                  totalCount={totalCount}
                  displayedCount={(() => {
                    const stockFilters = appliedFilters.StockStatus || [];
                    const filteredProducts = filterProductsByStock(products, stockFilters);
                    return filteredProducts.length;
                  })()}
                  className="text-sm text-gray-600"
                />

                <ProductsPerPage
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                  className="flex items-center space-x-2"
                />
              </div>

              {/* Products Grid/List */}
              <div className={`grid gap-6 ${
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
                  : 'grid-cols-1'
              }`}>
                {(() => {
                  // Apply stock status filtering on frontend
                  const stockFilters = appliedFilters.StockStatus || [];
                  const filteredProducts = filterProductsByStock(products, stockFilters);

                  if (filteredProducts.length === 0) {
                    return (
                      <div className="col-span-full text-center py-12">
                        <div className="text-gray-400 mb-4">
                          <Search className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                      </div>
                    );
                  }

                  return filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode={viewMode}
                      onQuickView={handleQuickView}
                    />
                  ));
                })()}
              </div>

              {/* Pagination */}
              {products.length > 0 && totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={hookCurrentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={hasNextPage}
                    hasPreviousPage={hasPreviousPage}
                    className="justify-center"
                  />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50 hover:scale-110"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        )}

        <Footer />
        <Cart />

        {/* Quick View Modal */}
        <QuickViewModal
          product={quickViewProduct}
          isOpen={isQuickViewOpen}
          onClose={handleCloseQuickView}
        />
      </div>
    </ErrorBoundary>
  );
}

export default function ProductsPage() {
  return <ProductsPageContent />;
}
