'use client';

import React, { useState, useEffect } from 'react';
import { Truck, X, Gift, ShoppingCart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

// Free shipping threshold - matches backend configuration
const FREE_SHIPPING_THRESHOLD = 120;

export interface FreeShippingBannerProps {
  /** Banner placement location */
  placement?: 'top' | 'header' | 'cart' | 'product' | 'checkout';
  /** Whether the banner can be dismissed by users */
  dismissible?: boolean;
  /** Custom message override */
  customMessage?: string;
  /** Whether to show progress bar for threshold-based shipping */
  showProgress?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show the banner persistently */
  persistent?: boolean;
  /** Custom threshold amount (overrides default) */
  customThreshold?: number;
  /** Center the content */
  centered?: boolean;
  /** Optional background color override */
  backgroundColor?: string;
  /** Optional text color override */
  textColor?: string;
}

export const FreeShippingBanner: React.FC<FreeShippingBannerProps> = ({
  placement = 'top',
  dismissible = true,
  customMessage,
  showProgress = true,
  className = '',
  persistent = false,
  customThreshold,
  centered = false,
  backgroundColor,
  textColor
}) => {
  const { cart, guestCart, isGuestMode } = useCart();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Use custom threshold or default
  const threshold = customThreshold || FREE_SHIPPING_THRESHOLD;

  // Get current cart
  const currentCart = isGuestMode ? guestCart : cart;
  const cartSubtotal = currentCart?.subtotal || 0;

  // Debug logging for troubleshooting
  if (placement === 'top') {
    console.log('FreeShippingBanner Debug:', {
      placement,
      isDismissed,
      isVisible,
      persistent,
      dismissible,
      cartSubtotal,
      customMessage
    });
  }

  // Calculate free shipping status
  const qualifiesForFreeShipping = cartSubtotal >= threshold;
  const remainingAmount = Math.max(threshold - cartSubtotal, 0);
  const progressPercentage = Math.min((cartSubtotal / threshold) * 100, 100);

  // Determine if we should use a custom theme (admin-selected colors)
  const isCustomTheme = Boolean(backgroundColor || textColor);

  // Handle dismissal with localStorage persistence
  useEffect(() => {
    if (dismissible && !persistent) {
      const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
      const dismissed = localStorage.getItem(dismissedKey) === 'true';
      setIsDismissed(dismissed);
    }
  }, [dismissible, persistent, placement]);

  const handleDismiss = () => {
    if (dismissible) {
      setIsDismissed(true);
      setIsVisible(false);
      
      if (!persistent) {
        const dismissedKey = `freeShippingBanner_${placement}_dismissed`;
        localStorage.setItem(dismissedKey, 'true');
      }
    }
  };

  // Don't show if dismissed (unless persistent)
  if (isDismissed && !persistent) {
    return null;
  }

  // Don't show if not visible (but always show if persistent)
  if (!isVisible && !persistent) {
    return null;
  }

  // Generate message based on shipping status
  const getMessage = () => {
    if (customMessage) {
      return customMessage;
    }

    if (qualifiesForFreeShipping) {
      return "🎉 You qualify for FREE shipping!";
    } else {
      return `🚚 Add $${remainingAmount.toFixed(2)} more for FREE shipping!`;
    }
  };

  // Get banner styling based on placement
  const getBannerStyles = () => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 ease-in-out";
    
    switch (placement) {
      case 'top':
        return `${baseStyles} ${isCustomTheme ? '' : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'} py-3 px-4 text-center`;
      case 'header':
        return `${baseStyles} bg-orange-100 border-b border-orange-200 text-orange-800 py-2 px-4 text-center`;
      case 'cart':
        return `${baseStyles} bg-orange-50 border border-orange-200 rounded-lg p-4 text-orange-800`;
      case 'product':
        return `${baseStyles} bg-green-50 border border-green-200 rounded-lg p-3 text-green-800`;
      case 'checkout':
        return `${baseStyles} bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800`;
      default:
        return `${baseStyles} bg-orange-500 text-white py-3 px-4 text-center`;
    }
  };

  // Get icon based on status and placement
  const getIcon = () => {
    if (qualifiesForFreeShipping) {
      return <Gift className="h-5 w-5" />;
    } else {
      return <Truck className="h-5 w-5" />;
    }
  };

  // Get progress bar color based on placement
  const getProgressBarColor = () => {
    switch (placement) {
      case 'top':
        return 'bg-white bg-opacity-30';
      case 'header':
        return 'bg-orange-200';
      case 'cart':
        return 'bg-orange-200';
      case 'product':
        return 'bg-green-200';
      case 'checkout':
        return 'bg-blue-200';
      default:
        return 'bg-white bg-opacity-30';
    }
  };

  const getProgressFillColor = () => {
    switch (placement) {
      case 'top':
        return 'bg-white';
      case 'header':
        return 'bg-orange-500';
      case 'cart':
        return 'bg-orange-500';
      case 'product':
        return 'bg-green-500';
      case 'checkout':
        return 'bg-blue-500';
      default:
        return 'bg-white';
    }
  };

  

  return (
    <div 
      className={`${getBannerStyles()} ${className}`}
      style={isCustomTheme ? { backgroundColor: backgroundColor, color: textColor } : undefined}
      role="banner"
      aria-live="polite"
      aria-label="Free shipping notification"
    >
      {/* Background decoration for top placement */}
      {placement === 'top' && !isCustomTheme && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-20"></div>
      )}

      <div className={`relative flex items-center ${centered ? 'justify-center' : 'justify-between'}`}>
        {/* Main content */}
        <div className={`flex items-center space-x-3 ${centered ? 'justify-center' : ''} ${centered ? '' : 'flex-1'}`}>
          {/* Icon */}
          <div className="flex-shrink-0">
            {getIcon()}
          </div>

          {/* Message and progress */}
          <div className={`${centered ? 'min-w-0 text-center' : 'flex-1 min-w-0'}`}>
            <div className={`flex items-center space-x-2 ${centered ? 'justify-center' : ''}`}>
              <span className={`font-medium ${placement === 'top' && !isCustomTheme ? 'text-white' : ''} ${centered ? 'mx-auto' : ''}`}>
                {getMessage()}
              </span>
            </div>

            {/* Progress bar */}
            {showProgress && !qualifiesForFreeShipping && cartSubtotal > 0 && (
              <div className="mt-2">
                <div className={`w-full h-2 rounded-full ${getProgressBarColor()}`}>
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${getProgressFillColor()}`}
                    style={{ width: `${progressPercentage}%` }}
                    role="progressbar"
                    aria-valuenow={progressPercentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Free shipping progress: ${progressPercentage.toFixed(1)}%`}
                  />
                </div>
                <div className={`text-xs mt-1 ${placement === 'top' && !isCustomTheme ? 'text-white text-opacity-90' : 'opacity-75'} ${centered ? 'text-center' : ''}`}>
                  ${cartSubtotal.toFixed(2)} of ${threshold.toFixed(2)} for free shipping
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dismiss button */}
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`${centered ? 'absolute right-3 top-3' : 'flex-shrink-0 ml-3'} p-1 rounded-full transition-colors ${
              placement === 'top' 
                ? 'text-white hover:bg-white hover:bg-opacity-20' 
                : 'hover:bg-gray-200'
            }`}
            aria-label="Dismiss free shipping banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Convenience components for specific placements
export const TopFreeShippingBanner: React.FC<Omit<FreeShippingBannerProps, 'placement'>> = (props) => (
  <FreeShippingBanner {...props} placement="top" />
);

export const HeaderFreeShippingBanner: React.FC<Omit<FreeShippingBannerProps, 'placement'>> = (props) => (
  <FreeShippingBanner {...props} placement="header" />
);

export const CartFreeShippingBanner: React.FC<Omit<FreeShippingBannerProps, 'placement'>> = (props) => (
  <FreeShippingBanner {...props} placement="cart" />
);

export const ProductFreeShippingBanner: React.FC<Omit<FreeShippingBannerProps, 'placement'>> = (props) => (
  <FreeShippingBanner {...props} placement="product" />
);

export const CheckoutFreeShippingBanner: React.FC<Omit<FreeShippingBannerProps, 'placement'>> = (props) => (
  <FreeShippingBanner {...props} placement="checkout" />
);
