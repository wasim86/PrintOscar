// Payment API Service for Stripe and PayPal integration
import { API_BASE_URL } from './config';

export interface PaymentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
  items?: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
}

export interface StripePaymentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

export interface PayPalOrderResponse {
  success: boolean;
  orderId?: string;
  order?: any;
  error?: string;
}

class PaymentApiService {
  /**
   * Create Stripe Payment Intent
   */
  static async createStripePaymentIntent(request: PaymentRequest): Promise<StripePaymentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/payments/stripe/create-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment intent'
      };
    }
  }

  /**
   * Create PayPal Order
   */
  static async createPayPalOrder(request: PaymentRequest): Promise<PayPalOrderResponse> {
    try {
      const response = await fetch('/api/payments/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('PayPal order creation failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to create PayPal order'
      };
    }
  }

  /**
   * Capture PayPal Payment
   */
  static async capturePayPalPayment(orderID: string): Promise<any> {
    try {
      const response = await fetch('/api/payments/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status} ${response.statusText} ${text}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error('PayPal payment capture failed:', error);
      return {
        success: false,
        error: error.message || 'Failed to capture PayPal payment'
      };
    }
  }

  /**
   * Verify payment status (for both Stripe and PayPal)
   */
  static async verifyPayment(paymentId: string, provider: 'stripe' | 'paypal'): Promise<any> {
    try {
      const response = await fetch(`/api/payments/${provider}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
      });

      return await response.json();
    } catch (error: any) {
      console.error('Payment verification failed:', error);
      return {
        success: false,
        error: error.message || 'Payment verification failed'
      };
    }
  }
}

export default PaymentApiService;
