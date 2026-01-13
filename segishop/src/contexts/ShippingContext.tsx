'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ShippingApiService, ShippingAddress, ShippingOption, OrderTotals } from '@/services/shipping-api';
import { UserAddress } from '@/services/user-address-api';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

interface ShippingContextType {
  // Shipping address
  shippingAddress: ShippingAddress | null;
  setShippingAddress: (address: ShippingAddress | null) => void;
  selectedUserAddress: UserAddress | null;
  setSelectedUserAddress: (address: UserAddress | null) => void;

  // Shipping options
  shippingOptions: ShippingOption[];
  selectedShippingOption: ShippingOption | null;
  setSelectedShippingOption: (option: ShippingOption | null) => void;

  // Order totals
  orderTotals: OrderTotals | null;

  // Loading states
  isCalculatingShipping: boolean;
  isCalculatingTotals: boolean;

  // Methods
  calculateShippingOptions: () => Promise<void>;
  calculateOrderTotals: (couponCode?: string) => Promise<void>;
  validateShippingAddress: (address: ShippingAddress) => Promise<boolean>;
  convertUserAddressToShipping: (userAddress: UserAddress) => ShippingAddress;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

interface ShippingProviderProps {
  children: ReactNode;
}

export const ShippingProvider: React.FC<ShippingProviderProps> = ({ children }) => {
  const { customer, isAuthenticated } = useAuth();
  const { cart, guestCart } = useCart();
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [selectedUserAddress, setSelectedUserAddress] = useState<UserAddress | null>(null);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShippingOption, setSelectedShippingOption] = useState<ShippingOption | null>(null);
  const [orderTotals, setOrderTotals] = useState<OrderTotals | null>(null);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isCalculatingTotals, setIsCalculatingTotals] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculate shipping options when address or cart changes
  useEffect(() => {
    const currentCart = isAuthenticated ? cart : guestCart;
    if (shippingAddress && currentCart?.items.length) {
      calculateShippingOptions();
    }
  }, [shippingAddress, cart?.items.length, cart?.subtotal, guestCart?.items.length, guestCart?.subtotal, isAuthenticated]);

  // Auto-calculate totals when shipping option or cart changes
  useEffect(() => {
    const currentCart = isAuthenticated ? cart : guestCart;
    if (selectedShippingOption && shippingAddress && currentCart?.items.length) {
      calculateOrderTotals();
    }
  }, [selectedShippingOption, shippingAddress, cart?.items.length, cart?.subtotal, guestCart?.items.length, guestCart?.subtotal, isAuthenticated]);

  // Auto-update shipping address when user address changes
  useEffect(() => {
    if (selectedUserAddress) {
      const shippingAddr = convertUserAddressToShipping(selectedUserAddress);
      setShippingAddress(shippingAddr);
    }
  }, [selectedUserAddress]);

  const convertUserAddressToShipping = (userAddress: UserAddress): ShippingAddress => {
    return {
      firstName: userAddress.firstName,
      lastName: userAddress.lastName,
      address: userAddress.address1,
      apartment: userAddress.address2 || undefined,
      city: userAddress.city,
      state: userAddress.state,
      zipCode: userAddress.zipCode,
      country: userAddress.country,
      phone: userAddress.phone || undefined
    };
  };

  const calculateShippingOptions = async (): Promise<void> => {
    const currentCart = isAuthenticated ? cart : guestCart;
    if (!shippingAddress || !currentCart?.items.length) {
      setShippingOptions([]);
      return;
    }

    // Ensure required fields are present before calling backend
    const hasRequiredAddressFields =
      !!shippingAddress.firstName &&
      !!shippingAddress.lastName &&
      !!shippingAddress.address &&
      !!shippingAddress.city &&
      !!shippingAddress.state &&
      !!shippingAddress.zipCode;

    if (!hasRequiredAddressFields) {
      setShippingOptions([]);
      return;
    }

    setIsCalculatingShipping(true);
    setError(null);

    try {
      // Convert cart items to the format expected by the backend
      const cartItems = currentCart.items.map(item => {
        if (isAuthenticated && 'productSlug' in item) {
          // Authenticated cart item structure
          return {
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug || '',
            productPrice: item.productPrice,
            productImage: item.productImage,
            productAttributes: item.productAttributes,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            isInStock: item.isInStock,
            stockQuantity: item.stockQuantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          };
        } else {
          // Guest cart item structure
          const guestItem = item as any; // Type assertion for guest cart
          return {
            id: 0, // Use dummy integer ID for guest items since backend expects int
            productId: guestItem.productId,
            productName: guestItem.productName,
            productSlug: '',
            productPrice: guestItem.unitPrice,
            productImage: guestItem.productImage,
            productAttributes: guestItem.productAttributes,
            quantity: guestItem.quantity,
            totalPrice: guestItem.totalPrice,
            isInStock: true, // Guest cart doesn't track stock
            stockQuantity: 999, // Default for guest cart
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      });

      // Convert frontend camelCase address to backend PascalCase format
      const backendShippingAddress = {
        FirstName: shippingAddress.firstName,
        LastName: shippingAddress.lastName,
        Address: shippingAddress.address,
        Apartment: shippingAddress.apartment,
        City: shippingAddress.city,
        State: shippingAddress.state,
        ZipCode: shippingAddress.zipCode,
        Country: shippingAddress.country,
        Phone: shippingAddress.phone
      };

      // Create request in backend expected format (PascalCase)
      const backendRequest = {
        Items: cartItems,
        Subtotal: currentCart.subtotal,
        ShippingAddress: backendShippingAddress
      };

      const response = await ShippingApiService.calculateShippingOptions(backendRequest as any);

      if (response.success) {
        setShippingOptions(response.options);

        // Auto-select first available option if none selected
        if (!selectedShippingOption && response.options.length > 0) {
          setSelectedShippingOption(response.options[0]);
        }
      } else {
        setError(response.errorMessage || 'Failed to calculate shipping options');
        setShippingOptions([]);
      }
    } catch (error) {
      console.error('Error calculating shipping options:', error);
      setError('Failed to calculate shipping options');
      setShippingOptions([]);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const calculateOrderTotals = async (couponCode?: string): Promise<void> => {
    const currentCart = isAuthenticated ? cart : guestCart;
    if (!shippingAddress || !currentCart?.items.length) {
      setOrderTotals(null);
      return;
    }

    // Ensure required fields are present before calling backend
    const hasRequiredAddressFields =
      !!shippingAddress.firstName &&
      !!shippingAddress.lastName &&
      !!shippingAddress.address &&
      !!shippingAddress.city &&
      !!shippingAddress.state &&
      !!shippingAddress.zipCode;

    if (!hasRequiredAddressFields) {
      setOrderTotals(null);
      return;
    }

    setIsCalculatingTotals(true);
    setError(null);

    try {
      // Convert cart items to the format expected by the backend
      const cartItems = currentCart.items.map(item => {
        if (isAuthenticated && 'productSlug' in item) {
          // Authenticated cart item structure
          return {
            id: item.id,
            productId: item.productId,
            productName: item.productName,
            productSlug: item.productSlug || '',
            productPrice: item.productPrice,
            productImage: item.productImage,
            productAttributes: item.productAttributes,
            quantity: item.quantity,
            totalPrice: item.totalPrice,
            isInStock: item.isInStock,
            stockQuantity: item.stockQuantity,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt
          };
        } else {
          // Guest cart item structure
          const guestItem = item as any; // Type assertion for guest cart
          return {
            id: 0, // Use dummy integer ID for guest items since backend expects int
            productId: guestItem.productId,
            productName: guestItem.productName,
            productSlug: '',
            productPrice: guestItem.unitPrice,
            productImage: guestItem.productImage,
            productAttributes: guestItem.productAttributes,
            quantity: guestItem.quantity,
            totalPrice: guestItem.totalPrice,
            isInStock: true,
            stockQuantity: 999,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }
      });

      // Convert frontend camelCase address to backend PascalCase format
      const backendShippingAddress = {
        FirstName: shippingAddress.firstName,
        LastName: shippingAddress.lastName,
        Address: shippingAddress.address,
        Apartment: shippingAddress.apartment,
        City: shippingAddress.city,
        State: shippingAddress.state,
        ZipCode: shippingAddress.zipCode,
        Country: shippingAddress.country,
        Phone: shippingAddress.phone
      };

      // Create request in backend expected format (PascalCase)
      const backendRequest = {
        Items: cartItems,
        Subtotal: currentCart.subtotal,
        ShippingAddress: backendShippingAddress,
        SelectedShippingOptionId: selectedShippingOption?.id,
        CouponCode: couponCode
      };

      const response = await ShippingApiService.calculateOrderTotals(backendRequest as any);

      if (response.success) {
        setOrderTotals(response.totals);
      } else {
        setError(response.errorMessage || 'Failed to calculate order totals');
        setOrderTotals(null);
      }
    } catch (error) {
      console.error('Error calculating order totals:', error);
      setError('Failed to calculate order totals');
      setOrderTotals(null);
    } finally {
      setIsCalculatingTotals(false);
    }
  };

  const validateShippingAddress = async (address: ShippingAddress): Promise<boolean> => {
    setError(null);

    try {
      const response = await ShippingApiService.validateAddress(address);
      
      if (!response.success || !response.isValid) {
        setError(response.message || 'Invalid shipping address');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error validating address:', error);
      setError('Failed to validate address');
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Reset shipping data when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setShippingAddress(null);
      setShippingOptions([]);
      setSelectedShippingOption(null);
      setOrderTotals(null);
      setError(null);
    }
  }, [isAuthenticated]);

  const value: ShippingContextType = {
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
    calculateShippingOptions,
    calculateOrderTotals,
    validateShippingAddress,
    convertUserAddressToShipping,
    error,
    clearError,
  };

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
};

export const useShipping = (): ShippingContextType => {
  const context = useContext(ShippingContext);
  if (context === undefined) {
    throw new Error('useShipping must be used within a ShippingProvider');
  }
  return context;
};
