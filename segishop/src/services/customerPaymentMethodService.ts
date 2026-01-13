import { API_BASE_URL } from './config';

export interface CustomerPaymentMethod {
  id: number;
  customerId: number;
  type: string; // "card", "paypal"
  displayName: string;
  last4Digits?: string;
  cardBrand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerPaymentMethod {
  type: string;
  displayName: string;
  last4Digits?: string;
  cardBrand?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
  zipCode?: string;
  stripePaymentMethodId?: string;
  isDefault?: boolean;
}

export interface UpdateCustomerPaymentMethod {
  displayName?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

class CustomerPaymentMethodService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('printoscar_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async getPaymentMethods(): Promise<CustomerPaymentMethod[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Return empty array as fallback for demo purposes
      return [];
    }
  }

  async getPaymentMethod(id: number): Promise<CustomerPaymentMethod | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching payment method:', error);
      return null;
    }
  }

  async createPaymentMethod(paymentMethod: CreateCustomerPaymentMethod): Promise<CustomerPaymentMethod> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(paymentMethod),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw error;
    }
  }

  async updatePaymentMethod(id: number, updates: UpdateCustomerPaymentMethod): Promise<CustomerPaymentMethod | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  async deletePaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting payment method:', error);
      return false;
    }
  }

  async setDefaultPaymentMethod(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/customer/payment-methods/${id}/set-default`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 404) {
          return false;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error setting default payment method:', error);
      return false;
    }
  }
}

export const customerPaymentMethodService = new CustomerPaymentMethodService();
