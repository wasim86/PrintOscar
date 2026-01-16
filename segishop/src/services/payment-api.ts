// Payment API Service for Stripe and PayPal integration
import { API_BASE_URL } from './config';

export interface PaymentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, unknown>;
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
  order?: unknown;
  error?: string;
}

export interface PayPalCaptureResponse {
  success: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface VerifyPaymentResponse {
  success: boolean;
  status?: string;
  paymentId?: string;
  error?: string;
  [key: string]: unknown;
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
    } catch (error: unknown) {
      console.error('Stripe payment intent creation failed:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to create payment intent';
      return {
        success: false,
        error: message
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
    } catch (error: unknown) {
      console.error('PayPal order creation failed:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to create PayPal order';
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Capture PayPal Payment
   */
  static async capturePayPalPayment(orderID: string): Promise<PayPalCaptureResponse> {
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
      const data = (await response.json()) as PayPalCaptureResponse;
      return data;
    } catch (error: unknown) {
      console.error('PayPal payment capture failed:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Failed to capture PayPal payment';
      return {
        success: false,
        error: message
      };
    }
  }

  /**
   * Verify payment status (for both Stripe and PayPal)
   */
  static async verifyPayment(
    paymentId: string,
    provider: 'stripe' | 'paypal'
  ): Promise<VerifyPaymentResponse> {
    try {
      const response = await fetch(`/api/payments/${provider}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
      });

      const data = (await response.json()) as VerifyPaymentResponse;
      return data;
    } catch (error: unknown) {
      console.error('Payment verification failed:', error);
      const message =
        error instanceof Error && error.message
          ? error.message
          : 'Payment verification failed';
      return {
        success: false,
        error: message
      };
    }
  }
}

export default PaymentApiService;
