import { API_BASE_URL } from './config';

// Types for Shipping API
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface ShippingOption {
  id: number;
  title: string;
  methodType: string;
  cost: number;
  estimatedDays: string;
  isTaxable: boolean;
  isEnabled: boolean;
}

export interface ShippingCalculationRequest {
  items: any[];
  subtotal: number;
  shippingAddress: ShippingAddress;
}

export interface ShippingCalculationResponse {
  success: boolean;
  options: ShippingOption[];
  errorMessage?: string;
}

export interface TaxCalculationRequest {
  items: any[];
  subtotal: number;
  shippingAddress: ShippingAddress;
  selectedShippingOptionId?: number;
}

export interface TaxCalculationResponse {
  success: boolean;
  taxAmount: number;
  taxRate: number;
  isTaxable: boolean;
  errorMessage?: string;
}

export interface OrderTotalsRequest {
  items: any[];
  subtotal: number;
  shippingAddress: ShippingAddress;
  selectedShippingOptionId?: number;
  couponCode?: string;
}

export interface OrderTotals {
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  appliedCoupon?: string;
}

export interface OrderTotalsResponse {
  success: boolean;
  totals: OrderTotals;
  errorMessage?: string;
}

// Helper function for API requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    console.log('Making API request to:', url);
    console.log('Request options:', defaultOptions);

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      // Try to get error details from response
      let errorMessage = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.text();
        console.error('API Error Response:', errorData);
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        console.error('Could not parse error response');
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

class ShippingApiService {
  /**
   * Calculate available shipping options for a customer's cart and address
   */
  static async calculateShippingOptions(request: ShippingCalculationRequest): Promise<ShippingCalculationResponse> {
    return apiRequest<ShippingCalculationResponse>('/Shipping/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Calculate tax amount for a customer's cart and address
   */
  static async calculateTax(request: TaxCalculationRequest): Promise<TaxCalculationResponse> {
    return apiRequest<TaxCalculationResponse>('/Shipping/calculate-tax', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Calculate complete order totals including shipping, tax, and discounts
   */
  static async calculateOrderTotals(request: OrderTotalsRequest): Promise<OrderTotalsResponse> {
    return apiRequest<OrderTotalsResponse>('/Shipping/calculate-totals', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get shipping zones for address validation
   */
  static async getShippingZones(): Promise<{ success: boolean; zones: any[] }> {
    return apiRequest<{ success: boolean; zones: any[] }>('/Shipping/zones');
  }

  /**
   * Validate shipping address
   */
  static async validateAddress(address: ShippingAddress): Promise<{ success: boolean; isValid: boolean; message?: string }> {
    return apiRequest<{ success: boolean; isValid: boolean; message?: string }>('/Shipping/validate-address', {
      method: 'POST',
      body: JSON.stringify(address),
    });
  }
}

export { ShippingApiService };
