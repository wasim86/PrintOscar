// Individual Product Hook - Handles both slugs and IDs
import { useState, useEffect } from 'react';
import { simpleProductsApi, SimpleProduct } from '@/services/simple-products-api';

export interface UseProductReturn {
  product: SimpleProduct | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export interface UseProductOptions {
  // Either slug or id should be provided
  slug?: string;
  id?: number;
  // Auto-fetch on mount (default: true)
  autoFetch?: boolean;
}

export function useProduct(options: UseProductOptions): UseProductReturn {
  const { slug, id, autoFetch = true } = options;
  
  const [product, setProduct] = useState<SimpleProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async () => {
    // Validate input
    if (!slug && !id) {
      setError('Either slug or id must be provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let fetchedProduct: SimpleProduct | null = null;

      if (slug) {
        console.log('🔍 Fetching product by slug:', slug);
        fetchedProduct = await simpleProductsApi.getProductBySlug(slug);
      } else if (id) {
        console.log('🔍 Fetching product by ID:', id);
        fetchedProduct = await simpleProductsApi.getProductById(id);
      }

      if (fetchedProduct) {
        console.log('✅ Product fetched successfully:', fetchedProduct.name);
        setProduct(fetchedProduct);
      } else {
        const identifier = slug || id;
        setError(`Product not found: ${identifier}`);
        setProduct(null);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in useProduct:', errorMessage);
      setError(errorMessage);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProduct();
  };

  // Auto-fetch on mount or when slug/id changes
  useEffect(() => {
    if (autoFetch && (slug || id)) {
      console.log('🚀 useProduct: Auto-fetching product...', { slug, id });
      fetchProduct();
    }
  }, [slug, id, autoFetch]);

  return {
    product,
    loading,
    error,
    refetch,
  };
}

// Convenience hooks for specific use cases
export function useProductBySlug(slug: string, autoFetch: boolean = true): UseProductReturn {
  return useProduct({ slug, autoFetch });
}

export function useProductById(id: number, autoFetch: boolean = true): UseProductReturn {
  return useProduct({ id, autoFetch });
}

// Hook for dynamic product fetching (when you need to fetch different products)
export function useProductFetcher(): {
  product: SimpleProduct | null;
  loading: boolean;
  error: string | null;
  fetchBySlug: (slug: string) => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  clear: () => void;
} {
  const [product, setProduct] = useState<SimpleProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBySlug = async (slug: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching product by slug:', slug);
      
      const fetchedProduct = await simpleProductsApi.getProductBySlug(slug);
      
      if (fetchedProduct) {
        console.log('✅ Product fetched successfully:', fetchedProduct.name);
        setProduct(fetchedProduct);
      } else {
        setError(`Product not found: ${slug}`);
        setProduct(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in fetchBySlug:', errorMessage);
      setError(errorMessage);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchById = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching product by ID:', id);
      
      const fetchedProduct = await simpleProductsApi.getProductById(id);
      
      if (fetchedProduct) {
        console.log('✅ Product fetched successfully:', fetchedProduct.name);
        setProduct(fetchedProduct);
      } else {
        setError(`Product not found: ${id}`);
        setProduct(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error in fetchById:', errorMessage);
      setError(errorMessage);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setProduct(null);
    setError(null);
  };

  return {
    product,
    loading,
    error,
    fetchBySlug,
    fetchById,
    clear,
  };
}
