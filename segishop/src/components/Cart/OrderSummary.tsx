'use client';

import React, { useState } from 'react';
import { API_BASE_URL } from '@/services/config';
import { Truck, MapPin, Tag, Loader2, AlertCircle, CheckCircle, Gift } from 'lucide-react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { usePriceUtils } from '@/utils/priceUtils';
import { useCart } from '@/contexts/CartContext';
import { useShipping } from '@/contexts/ShippingContext';
import { useAuth } from '@/contexts/AuthContext';
import { ShippingAddress } from '@/services/shipping-api';
import { ResponsiveAddressSelector } from './ResponsiveAddressSelector';
import PromoCodeInput from './PromoCodeInput';

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 120;

interface OrderSummaryProps {
  showShippingOptions?: boolean;
  showCouponCode?: boolean;
  onAddressChange?: (address: ShippingAddress) => void;
  onProceedToPayment?: () => void;
  showPaymentButton?: boolean;
  className?: string;
  appliedCoupon?: {
    code: string;
    description: string;
    discountAmount: number;
  } | null;
  onCouponApplied?: (coupon: { code: string; description: string; discountAmount: number }, orderTotals?: any) => void;
  onCouponRemoved?: () => void;
}

export function OrderSummary({
  showShippingOptions = true,
  showCouponCode = true,
  onAddressChange,
  onProceedToPayment,
  showPaymentButton = false,
  className = '',
  appliedCoupon: externalAppliedCoupon,
  onCouponApplied,
  onCouponRemoved
}: OrderSummaryProps) {
  const { cart, guestCart, isGuestMode } = useCart();
  const { isAuthenticated } = useAuth();
  const { convertAndFormatPrice } = usePriceUtils();
  const {
    shippingAddress,
    setShippingAddress,
    selectedUserAddress,
    setSelectedUserAddress,
    shippingOptions,
    selectedShippingOption,
    setSelectedShippingOption,
    orderTotals,
    isCalculatingShipping,
    isCalculatingTotals,
    calculateOrderTotals,
    error,
    clearError
  } = useShipping();

  // Use external coupon state if provided, otherwise use internal state
  const [internalAppliedCoupon, setInternalAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountAmount: number;
  } | null>(null);
  const [couponOrderTotals, setCouponOrderTotals] = useState<any>(null);

  // Use external coupon if provided, otherwise use internal
  const appliedCoupon = externalAppliedCoupon !== undefined ? externalAppliedCoupon : internalAppliedCoupon;

  // Promo code functions
  const handleApplyCoupon = async (code: string, orderSubtotal: number, shippingAmount: number, taxAmount: number) => {
    try {
      const token = localStorage.getItem('printoscar_token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Add authorization header if user is logged in
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/coupons/apply`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code,
          orderSubtotal,
          shippingAmount,
          taxAmount
        })
      });

      // Handle authentication errors
      if (response.status === 401) {
        throw new Error('Please log in to apply coupons');
      }

      // Check if response has content before parsing JSON
      const responseText = await response.text();
      if (!responseText) {
        throw new Error('Server returned empty response');
      }

      const data = JSON.parse(responseText);

      if (data.success) {
        const couponData = {
          code: data.coupon.code,
          description: data.coupon.description,
          discountAmount: data.orderTotals.discountAmount
        };

        if (externalAppliedCoupon !== undefined) {
          // Using external coupon management - pass order totals
          onCouponApplied?.(couponData, data.orderTotals);
        } else {
          // Using internal coupon management
          setInternalAppliedCoupon(couponData);
        }

        setCouponOrderTotals(data.orderTotals);
        return data;
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, errorMessage: 'Failed to apply coupon' };
    }
  };

  const handleRemoveCoupon = async (orderSubtotal: number, shippingAmount: number, taxAmount: number) => {
    try {
      const token = localStorage.getItem('segishop_token');

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/coupons/remove`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          code: appliedCoupon?.code || '', // Include the coupon code
          orderSubtotal,
          shippingAmount,
          taxAmount
        })
      });

      const data = await response.json();

      if (data.success) {
        if (externalAppliedCoupon !== undefined) {
          onCouponRemoved?.();
        } else {
          setInternalAppliedCoupon(null);
        }
        setCouponOrderTotals(null);
        return data;
      } else {
        throw new Error(data.message || 'Failed to remove coupon');
      }
    } catch (error) {
      console.error('Error removing coupon:', error);
      throw error;
    }
  };

  // Validation helper functions
  const isAddressComplete = () => {
    // For authenticated users, check if they have a saved address selected OR a complete shipping address
    if (isAuthenticated) {
      return selectedUserAddress || (shippingAddress &&
        shippingAddress.firstName?.trim() &&
        shippingAddress.lastName?.trim() &&
        shippingAddress.address?.trim() &&
        shippingAddress.city?.trim() &&
        shippingAddress.state?.trim() &&
        shippingAddress.zipCode?.trim() &&
        shippingAddress.zipCode.trim().length >= 5);
    }

    // For guest users, check if shipping address is complete
    if (!shippingAddress) return false;

    return shippingAddress.firstName?.trim() &&
           shippingAddress.lastName?.trim() &&
           shippingAddress.address?.trim() &&
           shippingAddress.city?.trim() &&
           shippingAddress.state?.trim() &&
           shippingAddress.zipCode?.trim() &&
           shippingAddress.zipCode.trim().length >= 5;
  };

  const isShippingComplete = () => {
    return isAddressComplete() && selectedShippingOption;
  };

  // Get specific validation message for debugging
  const getValidationMessage = () => {
    const issues = [];

    if (!isAddressComplete()) {
      if (isAuthenticated) {
        issues.push("Select a saved address or complete your shipping information");
      } else {
        issues.push("Complete your shipping information");
      }
    }

    if (!selectedShippingOption) {
      issues.push("Select a shipping option");
    }

    return issues;
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This would typically open an address form modal
    // For now, we'll use a simple prompt (replace with proper form)
    const address: ShippingAddress = {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    };
    
    setShippingAddress(address);
    onAddressChange?.(address);
  };

  const handleShippingOptionChange = (optionId: number) => {
    const option = shippingOptions.find(opt => opt.id === optionId);
    if (option) {
      setSelectedShippingOption(option);
    }
  };



  // Get the appropriate cart data based on authentication status
  const currentCart = isGuestMode ? guestCart : cart;
  const hasItems = currentCart && currentCart.items && currentCart.items.length > 0;

  if (!hasItems) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  // Calculate free shipping progress
  const freeShippingProgress = Math.min((currentCart!.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - currentCart!.subtotal, 0);
  const qualifiesForFreeShipping = currentCart!.subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Free Shipping Progress */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
          {qualifiesForFreeShipping ? (
            <div className="flex items-center text-green-700">
              <Gift className="h-5 w-5 mr-2" />
              <span className="font-medium">🎉 You qualify for FREE Standard Shipping!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Free Shipping Progress</span>
                <span className="text-sm text-gray-600">
                  {convertAndFormatPrice(remainingForFreeShipping)} away from free shipping
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Spend ${FREE_SHIPPING_THRESHOLD}+ to get FREE Standard Shipping
              </p>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {showShippingOptions && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Shipping Address
            </h3>

            {isAuthenticated ? (
              <ResponsiveAddressSelector
                selectedAddress={selectedUserAddress}
                onAddressSelect={setSelectedUserAddress}
                onNewAddress={(address) => {
                  console.log('New address created:', address);
                }}
              />
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  Please log in to manage your shipping addresses
                </p>
                <button
                  onClick={handleAddressSubmit}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue as guest
                </button>
              </div>
            )}
          </div>
        )}

        {/* Shipping Options */}
        {showShippingOptions && shippingAddress && (
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
              <Truck className="h-4 w-4 mr-2" />
              Shipping Method
            </h3>
            
            {isCalculatingShipping ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-5 w-5 animate-spin text-orange-600 mr-2" />
                <span className="text-gray-600">Calculating shipping options...</span>
              </div>
            ) : shippingOptions.length > 0 ? (
              <div className="space-y-2">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors"
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={selectedShippingOption?.id === option.id}
                        onChange={() => handleShippingOptionChange(option.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{option.title}</div>
                        <div className="text-xs text-gray-600">{option.estimatedDays}</div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {option.cost === 0 ? 'FREE' : convertAndFormatPrice(option.cost)}
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center p-4 text-gray-500">
                No shipping options available for this address
              </div>
            )}
          </div>
        )}

        {/* Promo Code */}
        {showCouponCode && isAuthenticated && (
          <PromoCodeInput
            onApply={handleApplyCoupon}
            onRemove={handleRemoveCoupon}
            orderSubtotal={currentCart!.subtotal}
            shippingAmount={couponOrderTotals?.shippingAmount ?? orderTotals?.shippingCost ?? selectedShippingOption?.cost ?? 0}
            taxAmount={couponOrderTotals?.taxAmount ?? orderTotals?.taxAmount ?? 0}
            appliedCoupon={appliedCoupon}
            disabled={isCalculatingTotals || isCalculatingShipping}
          />
        )}

        {/* Order Totals */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({currentCart!.totalItems} items)</span>
              <SimplePriceDisplay
                price={currentCart!.subtotal}
                size="sm"
                className="text-gray-900"
              />
            </div>
            
            {selectedShippingOption && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping ({selectedShippingOption.title})</span>
                <span className="text-gray-900">
                  {isCalculatingTotals ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : couponOrderTotals ? (
                    couponOrderTotals.shippingAmount === 0 ? 'FREE' : convertAndFormatPrice(couponOrderTotals.shippingAmount)
                  ) : orderTotals ? (
                    orderTotals.shippingCost === 0 ? 'FREE' : convertAndFormatPrice(orderTotals.shippingCost)
                  ) : (
                    selectedShippingOption.cost === 0 ? 'FREE' : convertAndFormatPrice(selectedShippingOption.cost)
                  )}
                </span>
              </div>
            )}
            
            {orderTotals && orderTotals.taxAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <SimplePriceDisplay
                  price={orderTotals.taxAmount}
                  size="sm"
                  className="text-gray-900"
                />
              </div>
            )}
            
            {appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coupon Discount ({appliedCoupon.code})</span>
                <span className="text-green-600">-{convertAndFormatPrice(appliedCoupon.discountAmount)}</span>
              </div>
            )}

            {orderTotals && orderTotals.discountAmount > 0 && !appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="text-green-600">-{convertAndFormatPrice(orderTotals.discountAmount)}</span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">
                  {isCalculatingTotals ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (() => {
                    // Calculate total manually to ensure accuracy
                    const subtotal = currentCart!.subtotal;
                    const shippingCost = couponOrderTotals?.shippingAmount ?? orderTotals?.shippingCost ?? selectedShippingOption?.cost ?? 0;
                    const taxAmount = couponOrderTotals?.taxAmount ?? orderTotals?.taxAmount ?? 0;
                    const discountAmount = appliedCoupon?.discountAmount ?? couponOrderTotals?.discountAmount ?? orderTotals?.discountAmount ?? 0;

                    const calculatedTotal = subtotal + shippingCost + taxAmount - discountAmount;

                    return convertAndFormatPrice(calculatedTotal);
                  })()}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            {showPaymentButton && (
              <div className="pt-4">
                <button
                  onClick={() => {
                    if (isShippingComplete()) {
                      onProceedToPayment?.();
                    } else {
                      console.log('Validation failed:', getValidationMessage());
                    }
                  }}
                  disabled={isCalculatingTotals || !isShippingComplete()}
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                    isCalculatingTotals || !isShippingComplete()
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  }`}
                  aria-label={isShippingComplete() ? "Continue to review order" : `Cannot continue: ${getValidationMessage().join(', ')}`}
                >
                  {isCalculatingTotals ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Continue to Review
                    </>
                  )}
                </button>

                {/* Enhanced Validation Messages */}
                {!isShippingComplete() && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <svg className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">Complete the following to continue:</p>
                        <ul className="space-y-1">
                          {!isAddressComplete() && (
                            <li className="flex items-center space-x-1">
                              <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                              <span>
                                {isAuthenticated
                                  ? "Select a saved address or complete your shipping information"
                                  : "Complete your shipping information"
                                }
                              </span>
                            </li>
                          )}
                          {!selectedShippingOption && (
                            <li className="flex items-center space-x-1">
                              <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
                              <span>Select a shipping option</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
