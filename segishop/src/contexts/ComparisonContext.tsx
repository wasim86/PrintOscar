'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface Product {
  id: string;
  title?: string;
  name?: string;
  price?: number;
  salePrice?: number;
  image?: string;
  category?: string;
  description?: string;
  stock?: number;
  stockCount?: number;
  slug?: string;
  isFeatured?: boolean;
  attributes?: Array<{ name: string; value: string }>;
}

interface ComparisonContextType {
  comparedProducts: Product[];
  addToComparison: (product: Product) => boolean;
  removeFromComparison: (productId: string) => boolean;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  comparisonCount: number;
  maxComparisonLimit: number;
  canAddToComparison: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_LIMIT = 4;
const STORAGE_KEY = 'printoscar_comparison_products';

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  // Load comparison data from localStorage on mount
  useEffect(() => {
    try {
      const savedComparison = localStorage.getItem(STORAGE_KEY);
      if (savedComparison) {
        const parsed = JSON.parse(savedComparison);
        if (Array.isArray(parsed)) {
          setComparedProducts(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load comparison data from localStorage:', error);
    }
  }, []);

  // Save comparison data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedProducts));
    } catch (error) {
      console.warn('Failed to save comparison data to localStorage:', error);
    }
  }, [comparedProducts]);

  const addToComparison = useCallback((product: Product): boolean => {
    if (!product?.id) {
      console.warn('Cannot add product to comparison: missing product ID');
      return false;
    }

    if (comparedProducts.length >= MAX_COMPARISON_LIMIT) {
      console.warn(`Cannot add more than ${MAX_COMPARISON_LIMIT} products to comparison`);
      return false;
    }

    if (comparedProducts.some(p => p.id === product.id)) {
      console.warn('Product is already in comparison');
      return false;
    }

    setComparedProducts(prev => [...prev, product]);
    return true;
  }, [comparedProducts]);

  const removeFromComparison = useCallback((productId: string): boolean => {
    if (!productId) {
      console.warn('Cannot remove product from comparison: missing product ID');
      return false;
    }

    const initialLength = comparedProducts.length;
    setComparedProducts(prev => prev.filter(p => p.id !== productId));
    
    return comparedProducts.length !== initialLength;
  }, [comparedProducts]);

  const clearComparison = useCallback(() => {
    setComparedProducts([]);
  }, []);

  const isInComparison = useCallback((productId: string): boolean => {
    if (!productId) return false;
    return comparedProducts.some(p => p.id === productId);
  }, [comparedProducts]);

  const comparisonCount = comparedProducts.length;
  const canAddToComparison = comparisonCount < MAX_COMPARISON_LIMIT;

  const value: ComparisonContextType = {
    comparedProducts,
    addToComparison,
    removeFromComparison,
    clearComparison,
    isInComparison,
    comparisonCount,
    maxComparisonLimit: MAX_COMPARISON_LIMIT,
    canAddToComparison,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = (): ComparisonContextType => {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
};

export default ComparisonContext;
