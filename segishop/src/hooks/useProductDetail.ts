'use client';

import { useState, useEffect } from 'react';
import { simpleProductsApi, SimpleProduct } from '@/services/simple-products-api';

export interface UseProductDetailReturn {
  product: SimpleProduct | null;
  relatedProducts: SimpleProduct[];
  loading: boolean;
  error: string | null;
  apiHealthy: boolean;
  refetch: () => Promise<void>;
}

export function useProductDetail(slug: string): UseProductDetailReturn {
  const [product, setProduct] = useState<SimpleProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<SimpleProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState(false);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      // Step 1: Test API connection
      console.log('🔍 Step 1: Testing API connection...');
      const isHealthy = await simpleProductsApi.testConnection();
      setApiHealthy(isHealthy);

      if (!isHealthy) {
        throw new Error('API is not responding. Please check if the API server is accessible.');
      }

      // Step 2: Fetch product by slug
      console.log('🔍 Step 2: Fetching product by slug...');
      const fetchedProduct = await simpleProductsApi.getProductBySlug(slug);

      if (!fetchedProduct) {
        throw new Error('Product not found');
      }

      console.log('✅ Product fetched successfully:', fetchedProduct.name);
      setProduct(fetchedProduct);

      // Step 3: Fetch related products
      console.log('🔍 Step 3: Fetching related products...');
      const fetchedRelatedProducts = await simpleProductsApi.getRelatedProducts(
        fetchedProduct.categoryId, 
        fetchedProduct.id, 
        4
      );

      console.log('✅ Related products fetched successfully:', fetchedRelatedProducts.length);
      setRelatedProducts(fetchedRelatedProducts);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error(`❌ Error in useProductDetail (slug: "${slug}"):`, errorMessage);
      setError(errorMessage);
      setProduct(null);
      setRelatedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProductDetail();
  };

  useEffect(() => {
    if (slug) {
      fetchProductDetail();
    }
  }, [slug]);

  return {
    product,
    relatedProducts,
    loading,
    error,
    apiHealthy,
    refetch,
  };
}
