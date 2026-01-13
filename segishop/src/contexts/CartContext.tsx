'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cartApi, CartSummary, CartItem, AddToCartRequest } from '@/services/cart-api';
import { API_BASE_URL } from '@/services/config';
import { useAuth } from './AuthContext';

// Guest cart item interface for localStorage
interface GuestCartItem {
  id: string; // temporary ID for guest items
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  effectivePrice: number;
  totalPrice: number;
  productAttributes?: string;
}

// Guest cart summary interface
interface GuestCartSummary {
  items: GuestCartItem[];
  totalItems: number;
  subtotal: number;
  uniqueItemsCount: number;
}

interface CartContextType {
  cart: CartSummary | null;
  guestCart: GuestCartSummary | null;
  isLoading: boolean;
  isCartOpen: boolean;
  isGuestMode: boolean;

  // Cart operations
  addToCart: (request: AddToCartRequest) => Promise<boolean>;
  updateQuantity: (cartItemId: number | string, quantity: number) => Promise<boolean>;
  removeFromCart: (cartItemId: number | string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;

  // UI operations
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;

  // Guest cart operations
  mergeGuestCartOnLogin: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { customer, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [guestCart, setGuestCart] = useState<GuestCartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const isGuestMode = !isAuthenticated;

  // Load cart based on authentication status
  useEffect(() => {
    if (isAuthenticated && customer?.id) {
      refreshCart();
      // Merge guest cart if exists
      mergeGuestCartOnLogin();
    } else {
      setCart(null);
      loadGuestCart();
    }
  }, [isAuthenticated, customer?.id]);

  // Load guest cart from localStorage
  const loadGuestCart = () => {
    try {
      const savedCart = localStorage.getItem('printoscar_guest_cart');
      if (savedCart) {
        const parsedCart: GuestCartSummary = JSON.parse(savedCart);
        setGuestCart(parsedCart);
      } else {
        setGuestCart({ items: [], totalItems: 0, subtotal: 0, uniqueItemsCount: 0 });
      }
    } catch (error) {
      console.error('Error loading guest cart:', error);
      setGuestCart({ items: [], totalItems: 0, subtotal: 0, uniqueItemsCount: 0 });
    }
  };

  // Save guest cart to localStorage
  const saveGuestCart = (cartData: GuestCartSummary) => {
    try {
      localStorage.setItem('segishop_guest_cart', JSON.stringify(cartData));
      setGuestCart(cartData);
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  };

  // Clear guest cart from localStorage
  const clearGuestCart = () => {
    try {
      localStorage.removeItem('segishop_guest_cart');
      setGuestCart({ items: [], totalItems: 0, subtotal: 0, uniqueItemsCount: 0 });
    } catch (error) {
      console.error('Error clearing guest cart:', error);
    }
  };

  const refreshCart = async () => {
    if (!customer?.id) return;

    setIsLoading(true);
    try {
      const response = await cartApi.getCart(customer.id);
      if (response.success && response.cart) {
        setCart(response.cart);
      } else {
        console.error('Failed to load cart:', response.message);
        setCart(null);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Merge guest cart when user logs in
  const mergeGuestCartOnLogin = async () => {
    const savedGuestCart = localStorage.getItem('segishop_guest_cart');
    if (!savedGuestCart || !customer?.id) return;

    try {
      const guestCartData: GuestCartSummary = JSON.parse(savedGuestCart);
      if (guestCartData.items.length === 0) return;

      // Add each guest cart item to user cart
      for (const item of guestCartData.items) {
        await cartApi.addToCart(customer.id, {
          productId: item.productId,
          quantity: item.quantity,
          productAttributes: item.productAttributes
        });
      }

      // Clear guest cart after merging
      clearGuestCart();
      // Refresh user cart to show merged items
      await refreshCart();
    } catch (error) {
      console.error('Error merging guest cart:', error);
    }
  };

  const addToCart = async (request: AddToCartRequest): Promise<boolean> => {
    setIsLoading(true);

    try {
      if (isAuthenticated && customer?.id) {
        // Authenticated user - use API
        const response = await cartApi.addToCart(customer.id, request);
        if (response.success) {
          await refreshCart();
          setIsCartOpen(true);
          return true;
        } else {
          console.error('Failed to add to cart:', response.message);
          return false;
        }
      } else {
        // Guest user - use localStorage
        return addToGuestCart(request);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to guest cart
  const addToGuestCart = async (request: AddToCartRequest): Promise<boolean> => {
    try {
      // Fetch product details from API to get real product information
      let productName = `Product ${request.productId}`;
      let productImage = undefined;
      let unitPrice = 50;
      let effectivePrice = request.calculatedPrice || unitPrice;

      try {
        // Fetch product details from the API
        const base = API_BASE_URL || '';
        const url = base ? `${base}/products/${request.productId}` : `/api/products/${request.productId}`;
        const response = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
        if (response.ok) {
          const productData = await response.json();
          console.log('Product API response:', productData); // Debug log
          if (productData.success && productData.product) {
            productName = productData.product.name;
            productImage = productData.product.imageUrl;
            unitPrice = productData.product.price;
            effectivePrice = request.calculatedPrice || unitPrice;
          }
        } else {
          console.warn('Product API response not OK:', response.status, response.statusText);
        }
      } catch (error) {
        console.warn('Failed to fetch product details for guest cart:', error);
        // Continue with placeholder data
      }

      const currentCart = guestCart || { items: [], totalItems: 0, subtotal: 0, uniqueItemsCount: 0 };

      // Check if item already exists
      const existingItemIndex = currentCart.items.findIndex(
        item => item.productId === request.productId &&
                item.productAttributes === request.productAttributes
      );

      let updatedItems = [...currentCart.items];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        const newQty = updatedItems[existingItemIndex].quantity + request.quantity;
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          productName,
          productImage,
          unitPrice,
          effectivePrice,
          quantity: newQty,
          totalPrice: effectivePrice * newQty,
        };
      } else {
        // Add new item
        const newItem: GuestCartItem = {
          id: `guest_${Date.now()}_${request.productId}`,
          productId: request.productId,
          productName,
          productImage,
          quantity: request.quantity,
          unitPrice,
          effectivePrice,
          totalPrice: effectivePrice * request.quantity,
          productAttributes: request.productAttributes
        };
        updatedItems.push(newItem);
      }

      // Calculate totals
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      const updatedCart: GuestCartSummary = {
        items: updatedItems,
        totalItems,
        subtotal,
        uniqueItemsCount: updatedItems.length
      };

      saveGuestCart(updatedCart);
      setIsCartOpen(true);
      return true;
    } catch (error) {
      console.error('Error adding to guest cart:', error);
      return false;
    }
  };

  const updateQuantity = async (cartItemId: number | string, quantity: number): Promise<boolean> => {
    if (isAuthenticated && customer?.id) {
      // Authenticated user - use API
      const numericId = typeof cartItemId === 'string' ? parseInt(cartItemId) : cartItemId;

      // Optimistic update - update UI immediately
      if (cart) {
        const updatedItems = cart.items.map(item =>
          item.id === numericId
            ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
            : item
        );

        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        setCart({
          ...cart,
          items: updatedItems,
          totalItems: newTotalItems,
          subtotal: newSubtotal,
          uniqueItemsCount: updatedItems.length
        });
      }

      try {
        const numericId = typeof cartItemId === 'string' ? parseInt(cartItemId) : cartItemId;
        const response = await cartApi.updateCartItem(customer.id, numericId, { quantity });
        if (response.success) {
          // Silently refresh cart in background to sync with server
          await refreshCart();
          return true;
        } else {
          console.error('Failed to update cart item:', response.message);
          // Revert optimistic update on failure
          await refreshCart();
          return false;
        }
      } catch (error) {
        console.error('Error updating cart item:', error);
        // Revert optimistic update on failure
        await refreshCart();
        return false;
      }
    } else {
      // Guest user - update localStorage
      return updateGuestCartQuantity(cartItemId as string, quantity);
    }
  };

  // Update guest cart item quantity
  const updateGuestCartQuantity = (itemId: string, quantity: number): boolean => {
    try {
      if (!guestCart) return false;

      const updatedItems = guestCart.items.map(item =>
        item.id === itemId
          ? { ...item, quantity, totalPrice: item.effectivePrice * quantity }
          : item
      );

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      const updatedCart: GuestCartSummary = {
        items: updatedItems,
        totalItems,
        subtotal,
        uniqueItemsCount: updatedItems.length
      };

      saveGuestCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Error updating guest cart quantity:', error);
      return false;
    }
  };

  const removeFromCart = async (cartItemId: number | string): Promise<boolean> => {
    if (isAuthenticated && customer?.id) {
      // Authenticated user - use API
      const numericId = typeof cartItemId === 'string' ? parseInt(cartItemId) : cartItemId;

      // Optimistic update - remove item immediately from UI
      if (cart) {
        const updatedItems = cart.items.filter(item => item.id !== numericId);
        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

        setCart({
          ...cart,
          items: updatedItems,
          totalItems: newTotalItems,
          subtotal: newSubtotal,
          uniqueItemsCount: updatedItems.length
        });
      }

      try {
        const numericId = typeof cartItemId === 'string' ? parseInt(cartItemId) : cartItemId;
        const response = await cartApi.removeFromCart(customer.id, numericId);
        if (response.success) {
          // Silently refresh cart in background to sync with server
          await refreshCart();
          return true;
        } else {
          console.error('Failed to remove from cart:', response.message);
          // Revert optimistic update on failure
          await refreshCart();
          return false;
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        // Revert optimistic update on failure
        await refreshCart();
        return false;
      }
    } else {
      // Guest user - remove from localStorage
      return removeFromGuestCart(cartItemId as string);
    }
  };

  // Remove item from guest cart
  const removeFromGuestCart = (itemId: string): boolean => {
    try {
      if (!guestCart) return false;

      const updatedItems = guestCart.items.filter(item => item.id !== itemId);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      const updatedCart: GuestCartSummary = {
        items: updatedItems,
        totalItems,
        subtotal,
        uniqueItemsCount: updatedItems.length
      };

      saveGuestCart(updatedCart);
      return true;
    } catch (error) {
      console.error('Error removing from guest cart:', error);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    if (!customer?.id) {
      console.error('User not authenticated');
      return false;
    }

    setIsLoading(true);
    try {
      const response = await cartApi.clearCart(customer.id);
      if (response.success) {
        setCart(null);
        return true;
      } else {
        console.error('Failed to clear cart:', response.message);
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const value: CartContextType = {
    cart,
    guestCart,
    isLoading,
    isCartOpen,
    isGuestMode,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCart,
    closeCart,
    refreshCart,
    mergeGuestCartOnLogin,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
