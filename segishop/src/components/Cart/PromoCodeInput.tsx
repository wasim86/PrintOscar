'use client';

import React, { useState, useEffect } from 'react';
import { Tag, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { usePriceUtils } from '@/utils/priceUtils';
import { API_BASE_URL } from '@/services/config';

interface AvailableCoupon {
  code: string;
  description: string;
  type: number;
  value: number;
}

interface PromoCodeInputProps {
  onApply: (code: string, orderSubtotal: number, shippingAmount: number, taxAmount: number) => Promise<{
    success: boolean;
    message?: string;
    errorMessage?: string;
    coupon?: any;
    orderTotals?: {
      subtotal: number;
      discountAmount: number;
      subtotalAfterDiscount: number;
      shippingAmount: number;
      taxAmount: number;
      totalAmount: number;
    };
  }>;
  onRemove: (orderSubtotal: number, shippingAmount: number, taxAmount: number) => Promise<any>;
  orderSubtotal: number;
  shippingAmount: number;
  taxAmount: number;
  appliedCoupon?: {
    code: string;
    description: string;
    discountAmount: number;
  } | null;
  disabled?: boolean;
}

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  onApply,
  onRemove,
  orderSubtotal,
  shippingAmount,
  taxAmount,
  appliedCoupon,
  disabled = false
}) => {
  const { convertAndFormatPrice } = usePriceUtils();
  const [promoCode, setPromoCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);

  // Fetch available coupons
  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/coupons/available`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.coupons) {
          // Show only first 2-3 active coupons as suggestions
          setAvailableCoupons(data.coupons.slice(0, 3));
        }
      }
    } catch (error) {
      console.error('Error fetching available coupons:', error);
    }
  };

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const handleApply = async () => {
    if (!promoCode.trim()) {
      setMessage({ type: 'error', text: 'Please enter a promo code' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const result = await onApply(promoCode.trim().toUpperCase(), orderSubtotal, shippingAmount, taxAmount);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message || 'Promo code applied successfully!' });
        setPromoCode('');
        setIsExpanded(false);
      } else {
        setMessage({ type: 'error', text: result.errorMessage || result.message || 'Invalid promo code' });
      }
    } catch (error) {
      console.error('Error applying promo code:', error);
      setMessage({ type: 'error', text: 'Failed to apply promo code. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await onRemove(orderSubtotal, shippingAmount, taxAmount);
      setMessage({ type: 'success', text: 'Promo code removed' });
    } catch (error) {
      console.error('Error removing promo code:', error);
      setMessage({ type: 'error', text: 'Failed to remove promo code' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  // Clear message after 5 seconds
  React.useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      {/* Applied Coupon Display */}
      {appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-green-100 rounded-full">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Promo Code Applied</p>
                <p className="text-sm text-gray-600">{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              disabled={disabled || isLoading}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove promo code"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-green-600" />
              <span className="font-mono font-medium text-green-800">{appliedCoupon.code}</span>
            </div>
            <span className="font-medium text-green-800">
              -{convertAndFormatPrice(appliedCoupon.discountAmount)}
            </span>
          </div>
        </div>
      ) : (
        /* Promo Code Input */
        <div className="space-y-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={disabled}
            className="flex items-center justify-between w-full text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-gray-900">Have a promo code?</span>
            </div>
            <span className="text-sm text-orange-600">
              {isExpanded ? 'Hide' : 'Apply'}
            </span>
          </button>

          {isExpanded && (
            <div className="space-y-3 pt-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    disabled={disabled || isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 text-black"
                  />
                </div>
                <button
                  onClick={handleApply}
                  disabled={disabled || isLoading || !promoCode.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Apply</span>
                  )}
                </button>
              </div>

              {/* Available Promo Codes Hint */}
              {availableCoupons.length > 0 && (
                <div className="text-xs text-gray-500">
                  <p>💡 Available codes: {availableCoupons.map((coupon, index) => (
                    <span key={coupon.code}>
                      <span
                        className="font-mono bg-gray-100 px-1 rounded cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => setPromoCode(coupon.code)}
                        title={coupon.description}
                      >
                        {coupon.code}
                      </span>
                      {index < availableCoupons.length - 1 && ', '}
                    </span>
                  ))}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Message Display */}
      {message && (
        <div className={`mt-3 p-3 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          )}
          <span className={`text-sm ${
            message.type === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
            {message.text}
          </span>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center space-x-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoCodeInput;
