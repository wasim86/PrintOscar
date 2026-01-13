'use client';

import { useState, useCallback } from 'react';
import { ShippingApiService, ShippingAddress, ShippingOption } from '@/services/shipping-api';
import { CartSummary } from '@/services/cart-api';

export interface ShippingCalculationResult {
  options: ShippingOption[];
  selectedOption: ShippingOption | null;
  isLoading: boolean;
  error: string | null;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export const useShippingCalculation = () => {
  const [shippingResult, setShippingResult] = useState<ShippingCalculationResult>({
    options: [],
    selectedOption: null,
    isLoading: false,
    error: null
  });

  const calculateShipping = useCallback(async (
    cart: CartSummary | null,
    address: ShippingAddress
  ): Promise<ShippingCalculationResult> => {
    if (!cart || !cart.items.length) {
      return {
        options: [],
        selectedOption: null,
        isLoading: false,
        error: 'No items in cart'
      };
    }

    // Validate required address fields for shipping calculation
    if (!address.city || !address.state || !address.zipCode || !address.country) {
      return {
        options: [],
        selectedOption: null,
        isLoading: false,
        error: 'Complete address required for shipping calculation'
      };
    }

    setShippingResult(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Convert cart items to the format expected by shipping API
      const items = cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));

      const response = await ShippingApiService.calculateShippingOptions({
        items,
        subtotal: cart.subtotal,
        shippingAddress: address
      });

      if (response.success && response.options.length > 0) {
        // Select the first option by default (usually standard shipping)
        const defaultOption = response.options[0];
        
        const result = {
          options: response.options,
          selectedOption: defaultOption,
          isLoading: false,
          error: null
        };

        setShippingResult(result);
        return result;
      } else {
        const result = {
          options: [],
          selectedOption: null,
          isLoading: false,
          error: response.errorMessage || 'No shipping options available for this address'
        };

        setShippingResult(result);
        return result;
      }
    } catch (error) {
      console.error('Shipping calculation error:', error);
      const result = {
        options: [],
        selectedOption: null,
        isLoading: false,
        error: 'Failed to calculate shipping options'
      };

      setShippingResult(result);
      return result;
    }
  }, []);

  const calculateTax = useCallback(async (
    cart: CartSummary | null,
    address: ShippingAddress,
    selectedShippingOptionId?: number
  ): Promise<number> => {
    if (!cart || !address.state || !address.zipCode) {
      return 0;
    }

    try {
      const items = cart.items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productPrice: item.productPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice
      }));

      const response = await ShippingApiService.calculateTax({
        items,
        subtotal: cart.subtotal,
        shippingAddress: address,
        selectedShippingOptionId
      });

      return response.success ? response.taxAmount : 0;
    } catch (error) {
      console.error('Tax calculation error:', error);
      return cart.subtotal * 0.08; // Fallback to 8% tax
    }
  }, []);

  const calculateOrderTotals = useCallback(async (
    cart: CartSummary | null,
    address: ShippingAddress,
    selectedShippingOption: ShippingOption | null,
    discount: number = 0
  ): Promise<OrderTotals> => {
    if (!cart) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        discount: 0,
        total: 0
      };
    }

    const subtotal = cart.subtotal;
    const shipping = selectedShippingOption?.cost || 0;
    const tax = await calculateTax(cart, address, selectedShippingOption?.id);
    const total = subtotal + shipping + tax - discount;

    return {
      subtotal,
      shipping,
      tax,
      discount,
      total: Math.max(0, total)
    };
  }, [calculateTax]);

  const selectShippingOption = useCallback((option: ShippingOption) => {
    setShippingResult(prev => ({
      ...prev,
      selectedOption: option
    }));
  }, []);

  return {
    shippingResult,
    calculateShipping,
    calculateTax,
    calculateOrderTotals,
    selectShippingOption
  };
};
