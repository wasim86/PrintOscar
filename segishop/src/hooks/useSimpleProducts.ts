// Simple Products Hook - Step by Step Integration
import { useState, useEffect } from 'react';
import { simpleProductsApi, SimpleProduct, SimpleCategory } from '@/services/simple-products-api';

export interface UseSimpleProductsReturn {
  products: SimpleProduct[];
  categories: SimpleCategory[];
  loading: boolean;
  error: string | null;
  apiHealthy: boolean;
  refetch: () => Promise<void>;
  filterByCategory: (categoryId: number | null) => void;
  sortProducts: (sortBy: string, sortOrder: string) => void;
  selectedCategoryId: number | null;
  currentSortBy: string;
  currentSortOrder: string;
  // Slug support
  getProductBySlug: (slug: string) => Promise<SimpleProduct | null>;
  getProductById: (id: number) => Promise<SimpleProduct | null>;
}

export function useSimpleProducts(): UseSimpleProductsReturn {
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentSortBy, setCurrentSortBy] = useState<string>('featured');
  const [currentSortOrder, setCurrentSortOrder] = useState<string>('desc');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchProducts = async () => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);

      // Step 1: Test API connection
      console.log('🔍 Step 1: Testing API connection...');
      const isHealthy = await simpleProductsApi.testConnection();
      setApiHealthy(isHealthy);

      if (!isHealthy) {
        throw new Error('API is not responding. Please check if the API server is accessible.');
      }

      // Step 2: Fetch categories and products in parallel with sorting
      console.log('🔍 Step 2: Fetching categories and products with sorting...');
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        simpleProductsApi.getAllProducts(currentSortBy, currentSortOrder),
        simpleProductsApi.getAllCategories()
      ]);

      console.log('✅ Products fetched successfully:', fetchedProducts.length);
      console.log('✅ Categories fetched successfully:', fetchedCategories.length);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
      setIsInitialLoad(false);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in useSimpleProducts:', errorMessage);
      setError(errorMessage);
      setProducts([]);
      setCategories([]);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  const filterByCategory = async (categoryId: number | null) => {
    try {
      console.log('🔍 Filtering by category:', categoryId);
      setError(null);
      setSelectedCategoryId(categoryId);

      let fetchedProducts: SimpleProduct[];

      if (categoryId === null) {
        // Fetch all products with current sorting
        fetchedProducts = await simpleProductsApi.getAllProducts(currentSortBy, currentSortOrder);
      } else {
        // Fetch products by category with current sorting
        fetchedProducts = await simpleProductsApi.getProductsByCategory(categoryId, currentSortBy, currentSortOrder);
      }

      console.log('✅ Filtered products:', fetchedProducts.length);
      setProducts(fetchedProducts);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in filterByCategory:', errorMessage);
      setError(errorMessage);
    }
  };

  const sortProducts = async (sortBy: string, sortOrder: string) => {
    try {
      console.log('🔍 Sorting products:', sortBy, sortOrder);
      setError(null);
      setCurrentSortBy(sortBy);
      setCurrentSortOrder(sortOrder);

      let fetchedProducts: SimpleProduct[];

      if (selectedCategoryId === null) {
        // Sort all products
        fetchedProducts = await simpleProductsApi.getAllProducts(sortBy, sortOrder);
      } else {
        // Sort products by category
        fetchedProducts = await simpleProductsApi.getProductsByCategory(selectedCategoryId, sortBy, sortOrder);
      }

      console.log('✅ Sorted products:', fetchedProducts.length);
      setProducts(fetchedProducts);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in sortProducts:', errorMessage);
      setError(errorMessage);
    }
  };

  const refetch = async () => {
    await fetchProducts();
  };

  // Slug support methods
  const getProductBySlug = async (slug: string): Promise<SimpleProduct | null> => {
    try {
      console.log('🔍 Getting product by slug:', slug);
      return await simpleProductsApi.getProductBySlug(slug);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in getProductBySlug:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  const getProductById = async (id: number): Promise<SimpleProduct | null> => {
    try {
      console.log('🔍 Getting product by ID:', id);
      return await simpleProductsApi.getProductById(id);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in getProductById:', errorMessage);
      setError(errorMessage);
      return null;
    }
  };

  // Load products on mount
  useEffect(() => {
    console.log('🚀 useSimpleProducts: Component mounted, starting data fetch...');
    fetchProducts();
  }, []); // Empty dependency array - runs only once

  return {
    products,
    categories,
    loading,
    error,
    apiHealthy,
    refetch,
    filterByCategory,
    sortProducts,
    selectedCategoryId,
    currentSortBy,
    currentSortOrder,
    getProductBySlug,
    getProductById,
  };
}
