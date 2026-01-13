import { API_BASE_URL } from './config';

// Types
export interface UserAddress {
  id: number;
  userId: number;
  type: 'Home' | 'Work' | 'Other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserAddressRequest {
  type: 'Home' | 'Work' | 'Other';
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UpdateUserAddressRequest {
  type?: 'Home' | 'Work' | 'Other';
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface UserAddressResponse {
  success: boolean;
  address?: UserAddress;
  message?: string;
  errorMessage?: string;
}

export interface UserAddressesResponse {
  success: boolean;
  addresses: UserAddress[];
  errorMessage?: string;
}

export interface AddressValidationResponse {
  success: boolean;
  isValid: boolean;
  message?: string;
  errorMessage?: string;
  shippingZoneId?: number;
  shippingZoneName?: string;
}

// API Helper function
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('printoscar_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('printoscar_token');
      window.location.href = '/login';
      throw new Error('Authentication required');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

class UserAddressApiService {
  /**
   * Get all addresses for the authenticated user
   */
  static async getUserAddresses(): Promise<UserAddressesResponse> {
    return apiRequest<UserAddressesResponse>('/useraddress');
  }

  /**
   * Get a specific address by ID
   */
  static async getAddress(id: number): Promise<UserAddressResponse> {
    return apiRequest<UserAddressResponse>(`/useraddress/${id}`);
  }

  /**
   * Create a new address
   */
  static async createAddress(request: CreateUserAddressRequest): Promise<UserAddressResponse> {
    return apiRequest<UserAddressResponse>('/useraddress', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Update an existing address
   */
  static async updateAddress(id: number, request: UpdateUserAddressRequest): Promise<UserAddressResponse> {
    return apiRequest<UserAddressResponse>(`/useraddress/${id}`, {
      method: 'PUT',
      body: JSON.stringify(request),
    });
  }

  /**
   * Delete an address (soft delete)
   */
  static async deleteAddress(id: number): Promise<UserAddressResponse> {
    return apiRequest<UserAddressResponse>(`/useraddress/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Validate an address and get shipping zone information
   */
  static async validateAddress(request: CreateUserAddressRequest): Promise<AddressValidationResponse> {
    return apiRequest<AddressValidationResponse>('/useraddress/validate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Set an address as default
   */
  static async setAsDefault(id: number): Promise<UserAddressResponse> {
    return apiRequest<UserAddressResponse>(`/useraddress/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault: true }),
    });
  }

  /**
   * Get postal code suggestions
   */
  static async getPostalCodeSuggestions(partialCode: string, country: string, state?: string): Promise<{
    success: boolean;
    suggestions: string[];
    isValidFormat: boolean;
    message?: string;
  }> {
    const params = new URLSearchParams({
      partialCode,
      country,
      ...(state && { state })
    });

    return apiRequest<{
      success: boolean;
      suggestions: string[];
      isValidFormat: boolean;
      message?: string;
    }>(`/useraddress/postal-suggestions?${params}`);
  }
}

export { UserAddressApiService };
