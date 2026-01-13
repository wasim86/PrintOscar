import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import {
  convertApiProductToFrontend,
  convertApiCategoryToFrontend,
  FrontendProduct,
  FrontendCategory
} from '@/types/api';

export interface UseProductsOptions {
  searchTerm?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  inStock?: boolean;
  filters?: Record<string, string[]>;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
  includeFilters?: boolean;
  append?: boolean;
}

export interface UseProductsReturn {
  products: FrontendProduct[];
  categories: FrontendCategory[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  searchProducts: (options?: UseProductsOptions) => Promise<void>;
  loadCategories: () => Promise<void>;
  clearError: () => void;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [categories, setCategories] = useState<FrontendCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const clearError = () => {
    setError(null);
  };

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();

      if (response.success && response.categories) {
        const frontendCategories = response.categories.map(convertApiCategoryToFrontend);
        setCategories(frontendCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const searchProducts = async (options: UseProductsOptions & { append?: boolean } = {}) => {
    try {
      // Only show loading for initial load, not for load more
      if (!options.append) {
        setLoading(true);
      }
      setError(null);

      console.log('searchProducts called with options:', options);

      const { append, ...searchOptions } = options;
      const response = await api.searchProducts(searchOptions);

      console.log('API response:', response);

      if (response && response.success && response.data) {
        const { data } = response;
        console.log('Response data:', data);

        if (data.products && Array.isArray(data.products)) {
          try {
            const frontendProducts = data.products.map((product: any, index: number) => {
              try {
                return convertApiProductToFrontend(product);
              } catch (conversionError) {
                console.error(`Error converting product at index ${index}:`, conversionError, product);
                // Return a fallback product instead of failing completely
                return {
                  id: product.id?.toString() || `fallback-${index}`,
                  title: product.name || 'Product',
                  price: product.price || 0,
                  originalPrice: undefined,
                  image: '/placeholder-product.svg',
                  rating: 4.5,
                  reviewCount: 50,
                  category: product.categoryName || 'Uncategorized',
                  slug: `product-${product.id || index}`,
                  inStock: true,
                  tags: ['api-product'],
                  description: product.description || '',
                  stockCount: product.stock || 0,
                  isFeatured: false
                };
              }
            });

            console.log('Converted products:', frontendProducts);

            // Append or replace products based on the append flag
            if (append) {
              setProducts(prevProducts => [...prevProducts, ...frontendProducts]);
            } else {
              setProducts(frontendProducts);
            }

            setTotalCount(data.totalCount || 0);
            setTotalPages(data.totalPages || 0);
            setCurrentPage(data.page || 1);
            setHasNextPage(data.hasNextPage || false);
            setHasPreviousPage(data.hasPreviousPage || false);
          } catch (mappingError) {
            console.error('Error during product mapping:', mappingError);
            throw new Error('Failed to process products data');
          }
        } else {
          console.error('No products array in response data:', data);
          throw new Error('Invalid response format: missing products array');
        }
      } else {
        console.error('Invalid response format:', response);
        throw new Error('Failed to load products: Invalid response format');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error loading products:', err);

      // Set empty state on error
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
      setCurrentPage(1);
      setHasNextPage(false);
      setHasPreviousPage(false);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data only once
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        searchProducts({ page: 1, pageSize: 50 }),
        loadCategories()
      ]);
    };

    loadInitialData();
  }, []); // Empty dependency array to run only once

  return {
    products,
    categories,
    loading,
    error,
    totalCount,
    totalPages,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    searchProducts,
    loadCategories,
    clearError,
  };
}

// Hook for getting featured products
export function useFeaturedProducts(limit: number = 10) {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeaturedProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getFeaturedProducts(limit);
      
      if (response.success && response.products) {
        const frontendProducts = response.products.map(convertApiProductToFrontend);
        setProducts(frontendProducts);
      } else {
        throw new Error('Failed to load featured products');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load featured products';
      setError(errorMessage);
      console.error('Error loading featured products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadFeaturedProducts();
  }, [loadFeaturedProducts]);

  return {
    products,
    loading,
    error,
    reload: loadFeaturedProducts,
  };
}

// Hook for getting products by category
export function useProductsByCategory(categoryId: number, page: number = 1, pageSize: number = 20) {
  const [products, setProducts] = useState<FrontendProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getProductsByCategory(categoryId, page, pageSize);
      
      if (response.success && response.data) {
        const { data } = response;
        const frontendProducts = data.products.map(convertApiProductToFrontend);
        setProducts(frontendProducts);
        setTotalCount(data.totalCount);
        setTotalPages(data.totalPages);
      } else {
        throw new Error('Failed to load products');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error loading products by category:', err);
      setProducts([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [categoryId, page, pageSize]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    totalCount,
    totalPages,
    reload: loadProducts,
  };
}
