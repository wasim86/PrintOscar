import { API_BASE_URL } from './config';

export interface TrackOrderRequest {
  orderNumber: string;
  billingEmail: string;
}

export interface OrderTrackingData {
  orderNumber: string;
  status: string;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  total: number;
  paymentStatus: string;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  timeline: Array<{
    status: string;
    date: string;
    location?: string;
    description: string;
    notes?: string;
  }>;
}

export interface OrderTrackingResponse {
  success: boolean;
  message: string;
  errorCode?: string;
  data?: OrderTrackingData;
}

export class OrderTrackingApiService {
  static async trackOrder(request: TrackOrderRequest): Promise<OrderTrackingResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Orders/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 404) {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || 'Order not found. Please check your order number and billing email.',
            errorCode: errorData.errorCode || 'ORDER_NOT_FOUND'
          };
        }
        
        if (response.status === 400) {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || 'Please provide valid order number and billing email.',
            errorCode: errorData.errorCode || 'VALIDATION_ERROR'
          };
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OrderTrackingResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Order tracking API error:', error);
      return {
        success: false,
        message: 'Unable to track order. Please check your internet connection and try again.',
        errorCode: 'NETWORK_ERROR'
      };
    }
  }
}
