'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WishlistApiService, WishlistItem, AddToWishlistRequest, RemoveFromWishlistRequest } from '@/services/wishlist-api';
import { useAuth } from './AuthContext';
import { simpleProductsApi } from '@/services/simple-products-api';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Wishlist operations
  addToWishlist: (productId: number) => Promise<boolean>;
  removeFromWishlist: (productId: number) => Promise<boolean>;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
  
  // UI helpers
  clearError: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { customer, isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to get the correct wishlist localStorage key
  const getWishlistKey = (): string | null => {
    if (!customer?.id) return null;

    // First try the expected key
    const expectedKey = `wishlist_${customer.id}`;
    if (localStorage.getItem(expectedKey)) {
      return expectedKey;
    }

    // If not found, search for any wishlist key
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('wishlist_')) {
        console.log(`🔄 Using fallback wishlist key: ${key} instead of ${expectedKey}`);
        return key;
      }
    }

    // Return the expected key for new wishlists
    return expectedKey;
  };

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated && customer?.id) {
      refreshWishlist();
    } else {
      setWishlistItems([]);
      setWishlistCount(0);
    }
  }, [isAuthenticated, customer?.id]);

  const refreshWishlist = async () => {
    if (!customer?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Try API first, fallback to localStorage for demo
      try {
        const response = await WishlistApiService.getWishlist(customer.id);

        if (response.success) {
          setWishlistItems(response.items);
          setWishlistCount(response.totalCount);
          return;
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
      }

      // Fallback to localStorage for demo purposes
      let localWishlist = localStorage.getItem(`wishlist_${customer.id}`);

      // If not found with customer.id, try to find any wishlist data
      if (!localWishlist) {
        console.warn(`No wishlist found for customer ID: ${customer.id}, searching for alternative keys...`);

        // Search for any wishlist keys in localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('wishlist_')) {
            console.log(`🔍 Found alternative wishlist key: ${key}`);
            localWishlist = localStorage.getItem(key);
            if (localWishlist) {
              console.log(`✅ Using wishlist data from key: ${key}`);
              break;
            }
          }
        }
      }

      if (localWishlist) {
        const items = JSON.parse(localWishlist);
        setWishlistItems(items);
        setWishlistCount(items.length);
        console.log(`📋 Loaded ${items.length} items from wishlist`);
      } else {
        setWishlistItems([]);
        setWishlistCount(0);
        console.log(`📋 No wishlist data found`);
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
      setWishlistItems([]);
      setWishlistCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: number): Promise<boolean> => {
    if (!customer?.id) {
      setError('Please log in to add items to your wishlist');
      return false;
    }

    try {
      setError(null);

      // Check if product is already in wishlist
      if (isInWishlist(productId)) {
        setError('Product is already in your wishlist');
        return false;
      }

      // Try API first, fallback to localStorage for demo
      try {
        const request: AddToWishlistRequest = { productId };
        const response = await WishlistApiService.addToWishlist(customer.id, request);

        if (response.success) {
          // Update local state
          if (response.item) {
            setWishlistItems(prev => [response.item!, ...prev]);
          }
          setWishlistCount(response.wishlistCount);
          return true;
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
      }

      // Fallback to localStorage for demo purposes - fetch real product data
      let productData;
      try {
        productData = await simpleProductsApi.getProductById(productId);
      } catch (productError) {
        console.warn('Failed to fetch product details, using fallback data:', productError);
      }

      const mockItem = {
        id: Date.now(),
        productId,
        productName: productData?.name || `Product ${productId}`,
        productSlug: productData?.slug || `product-${productId}`,
        price: productData?.price || 29.99,
        salePrice: productData?.salePrice,
        imageUrl: productData?.imageUrl || '/placeholder-product.svg',
        categoryName: productData?.categoryName || 'Demo Category',
        inStock: productData ? (productData.stock || 0) > 0 : true,
        stock: productData?.stock || 10,
        dateAdded: new Date().toISOString(),
        sku: productData?.sku || `SKU-${productId}`,
        description: productData?.description || `Demo product ${productId}`,
        isFeatured: productData?.isFeatured || false,
        rating: 4.5, // Default rating since not available in SimpleProduct
        reviewCount: 10 // Default review count since not available in SimpleProduct
      };

      const newItems = [mockItem, ...wishlistItems];
      setWishlistItems(newItems);
      setWishlistCount(newItems.length);

      // Save to localStorage using the correct key
      const wishlistKey = getWishlistKey();
      if (wishlistKey) {
        localStorage.setItem(wishlistKey, JSON.stringify(newItems));
      }

      console.log(`✅ Added product ${productId} to wishlist. New count:`, newItems.length);

      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
      return false;
    }
  };

  const removeFromWishlist = async (productId: number): Promise<boolean> => {
    if (!customer?.id) {
      setError('Please log in to manage your wishlist');
      return false;
    }

    try {
      setError(null);

      // Try API first, fallback to localStorage for demo
      try {
        const request: RemoveFromWishlistRequest = { productId };
        const response = await WishlistApiService.removeFromWishlist(customer.id, request);

        if (response.success) {
          // Update local state
          setWishlistItems(prev => prev.filter(item => item.productId !== productId));
          setWishlistCount(response.wishlistCount);
          return true;
        }
      } catch (apiError) {
        console.warn('API not available, using localStorage fallback:', apiError);
      }

      // Fallback to localStorage for demo purposes
      const newItems = wishlistItems.filter(item => item.productId !== productId);
      setWishlistItems(newItems);
      setWishlistCount(newItems.length);

      // Save to localStorage using the correct key
      const wishlistKey = getWishlistKey();
      if (wishlistKey) {
        localStorage.setItem(wishlistKey, JSON.stringify(newItems));
      }

      //console.log(`✅ Removed product ${productId} from wishlist. New count:`, newItems.length);

      // Force a small delay to ensure state is updated
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;
    } catch (err) {
      //console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
      return false;
    }
  };

  const isInWishlist = (productId: number): boolean => {
    const inWishlist = wishlistItems.some(item => {
      // Handle both string and number productId types
      const itemProductId = typeof item.productId === 'string' ? parseInt(item.productId) : item.productId;
      return itemProductId === productId;
    });
    //console.log(`🔍 Checking if product ${productId} is in wishlist:`, inWishlist, 'Total items:', wishlistItems.length);
    if (wishlistItems.length > 0) {
      //console.log(`🔍 Wishlist productIds:`, wishlistItems.map(item => `${item.productId} (${typeof item.productId})`));
      //console.log(`🔍 Searching for: ${productId} (${typeof productId})`);
    }
    return inWishlist;
  };

  const clearWishlist = async (): Promise<boolean> => {
    if (!customer?.id) {
      setError('Please log in to manage your wishlist');
      return false;
    }

    try {
      setError(null);
      
      const response = await WishlistApiService.clearWishlist(customer.id);
      
      if (response.success) {
        setWishlistItems([]);
        setWishlistCount(0);
        return true;
      } else {
        setError(response.message);
        return false;
      }
    } catch (err) {
      console.error('Error clearing wishlist:', err);
      setError('Failed to clear wishlist');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: WishlistContextType = {
    wishlistItems,
    wishlistCount,
    isLoading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    refreshWishlist,
    clearError,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
