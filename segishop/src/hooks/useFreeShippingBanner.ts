'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/contexts/CartContext';

// Free shipping threshold - matches backend configuration
const FREE_SHIPPING_THRESHOLD = 120;

export interface FreeShippingStatus {
  /** Current cart subtotal */
  cartSubtotal: number;
  /** Free shipping threshold amount */
  threshold: number;
  /** Whether cart qualifies for free shipping */
  qualifiesForFreeShipping: boolean;
  /** Amount remaining to qualify for free shipping */
  remainingAmount: number;
  /** Progress percentage towards free shipping (0-100) */
  progressPercentage: number;
  /** Whether cart has any items */
  hasItems: boolean;
}

export interface FreeShippingBannerState {
  /** Whether banner is currently visible */
  isVisible: boolean;
  /** Whether banner has been dismissed by user */
  isDismissed: boolean;
  /** Current free shipping status */
  status: FreeShippingStatus;
}

export interface UseFreeShippingBannerOptions {
  /** Custom threshold amount (overrides default) */
  customThreshold?: number;
  /** Banner placement identifier for localStorage */
  placement?: string;
  /** Whether banner should persist after dismissal */
  persistent?: boolean;
  /** Whether to automatically show banner when cart changes */
  autoShow?: boolean;
}

export const useFreeShippingBanner = (options: UseFreeShippingBannerOptions = {}) => {
  const {
    customThreshold,
    placement = 'default',
    persistent = false,
    autoShow = true
  } = options;

  const { cart, guestCart, isGuestMode } = useCart();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Use custom threshold or default
  const threshold = customThreshold || FREE_SHIPPING_THRESHOLD;

  // Get current cart
  const currentCart = isGuestMode ? guestCart : cart;
  const cartSubtotal = currentCart?.subtotal || 0;
  const hasItems = (currentCart?.items?.length || 0) > 0;

  // Calculate free shipping status
  const qualifiesForFreeShipping = cartSubtotal >= threshold;
  const remainingAmount = Math.max(threshold - cartSubtotal, 0);
  const progressPercentage = Math.min((cartSubtotal / threshold) * 100, 100);

  // Create status object
  const status: FreeShippingStatus = {
    cartSubtotal,
    threshold,
    qualifiesForFreeShipping,
    remainingAmount,
    progressPercentage,
    hasItems
  };

  // Load dismissed state from localStorage
  useEffect(() => {
    if (!persistent) {
      const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
      const dismissed = localStorage.getItem(dismissedKey) === 'true';
      setIsDismissed(dismissed);
      setIsVisible(!dismissed);
    }
  }, [placement, persistent]);

  // Auto-show banner when cart changes (if autoShow is enabled)
  useEffect(() => {
    if (autoShow && hasItems && !isDismissed) {
      setIsVisible(true);
    }
  }, [cartSubtotal, hasItems, autoShow, isDismissed]);

  // Dismiss banner
  const dismissBanner = useCallback(() => {
    setIsDismissed(true);
    setIsVisible(false);

    if (!persistent) {
      const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
      localStorage.setItem(dismissedKey, 'true');
    }
  }, [placement, persistent]);

  // Show banner (useful for programmatic control)
  const showBanner = useCallback(() => {
    setIsDismissed(false);
    setIsVisible(true);

    if (!persistent) {
      const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
      localStorage.removeItem(dismissedKey);
    }
  }, [placement, persistent]);

  // Reset banner state (clears localStorage)
  const resetBanner = useCallback(() => {
    setIsDismissed(false);
    setIsVisible(true);

    const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
    localStorage.removeItem(dismissedKey);
  }, [placement]);

  // Get appropriate message based on status
  const getMessage = useCallback((customMessage?: string) => {
    if (customMessage) {
      return customMessage;
    }

    if (!hasItems) {
      return `🚚 Free shipping on orders over $${threshold.toFixed(2)}!`;
    }

    if (qualifiesForFreeShipping) {
      return "🎉 You qualify for FREE shipping!";
    } else {
      return `🚚 Add $${remainingAmount.toFixed(2)} more for FREE shipping!`;
    }
  }, [hasItems, qualifiesForFreeShipping, remainingAmount, threshold]);

  // Check if banner should be shown based on various conditions
  const shouldShowBanner = useCallback((conditions: {
    showWhenEmpty?: boolean;
    showWhenQualified?: boolean;
    showWhenNotQualified?: boolean;
  } = {}) => {
    const {
      showWhenEmpty = true,
      showWhenQualified = true,
      showWhenNotQualified = true
    } = conditions;

    if (isDismissed && !persistent) {
      return false;
    }

    if (!hasItems && !showWhenEmpty) {
      return false;
    }

    if (qualifiesForFreeShipping && !showWhenQualified) {
      return false;
    }

    if (!qualifiesForFreeShipping && hasItems && !showWhenNotQualified) {
      return false;
    }

    return isVisible;
  }, [isDismissed, persistent, hasItems, qualifiesForFreeShipping, isVisible]);

  const bannerState: FreeShippingBannerState = {
    isVisible,
    isDismissed,
    status
  };

  return {
    // State
    ...bannerState,
    
    // Actions
    dismissBanner,
    showBanner,
    resetBanner,
    
    // Utilities
    getMessage,
    shouldShowBanner,
    
    // Direct status access (for convenience)
    cartSubtotal,
    threshold,
    qualifiesForFreeShipping,
    remainingAmount,
    progressPercentage,
    hasItems
  };
};

// Convenience hooks for specific placements
export const useTopFreeShippingBanner = (options: Omit<UseFreeShippingBannerOptions, 'placement'> = {}) =>
  useFreeShippingBanner({ ...options, placement: 'top' });

export const useHeaderFreeShippingBanner = (options: Omit<UseFreeShippingBannerOptions, 'placement'> = {}) =>
  useFreeShippingBanner({ ...options, placement: 'header' });

export const useCartFreeShippingBanner = (options: Omit<UseFreeShippingBannerOptions, 'placement'> = {}) =>
  useFreeShippingBanner({ ...options, placement: 'cart' });

export const useProductFreeShippingBanner = (options: Omit<UseFreeShippingBannerOptions, 'placement'> = {}) =>
  useFreeShippingBanner({ ...options, placement: 'product' });

export const useCheckoutFreeShippingBanner = (options: Omit<UseFreeShippingBannerOptions, 'placement'> = {}) =>
  useFreeShippingBanner({ ...options, placement: 'checkout' });
