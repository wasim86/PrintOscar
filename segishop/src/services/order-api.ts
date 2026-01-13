import { API_BASE_URL } from './config';

// Types for order creation
export interface CreateOrderRequest {
  // For authenticated users - undefined for guest orders
  userId?: number;

  // Guest customer information (required when userId is undefined)
  guestEmail?: string;
  guestFirstName?: string;
  guestLastName?: string;
  guestPhone?: string;

  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentInfo: PaymentInfo;
  totals: OrderTotals;
  couponId?: number;
  couponCode?: string;
  couponDiscountAmount?: number;
  shippingZoneMethodId?: number;
  shippingMethodTitle?: string;
  notes?: string;
}

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

export interface OrderItem {
  productId: number;
  productName: string;
  productSKU?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productAttributes?: string;
  configurations?: OrderItemConfiguration[];
}

export interface OrderItemConfiguration {
  configurationTypeId: number;
  configurationOptionId?: number;
  customValue?: string;
}

export interface PaymentInfo {
  paymentMethod: string; // "stripe", "paypal"
  paymentStatus: string; // "success", "pending", "failed"
  paymentTransactionId?: string;
  paymentIntentId?: string;
  amount: number;
  currency?: string;
  paymentMethodDetails?: string;
}

export interface OrderTotals {
  subTotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
}

// Response types
export interface CreateOrderResponse {
  success: boolean;
  message: string;
  order?: OrderResponse;
  errorCode?: string;
  validationErrors?: string[];
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subTotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  paymentTransactionId?: string;
  notes?: string;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone?: string;
  shippingMethodTitle?: string;
  couponCode?: string;
  couponDiscountAmount: number;
  customer: CustomerInfo;
  items: OrderItemResponse[];
}

// Order list response types
export interface OrderListResponse {
  orders: OrderSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface OrderSummary {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingMethodTitle?: string;
}

export interface CustomerInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface OrderItemResponse {
  id: number;
  productId: number;
  productName: string;
  productSKU?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productAttributes?: string;
  configurations?: OrderItemConfigurationResponse[];
}

export interface OrderItemConfigurationResponse {
  id: number;
  configurationTypeId: number;
  configurationTypeName: string;
  configurationOptionId?: number;
  configurationOptionName?: string;
  customValue?: string;
}

// Order API service
export class OrderApiService {
  private static baseUrl = `${API_BASE_URL}/orders`;

  /**
   * Create a new order
   */
  static async createOrder(orderData: CreateOrderRequest): Promise<CreateOrderResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: result.message || 'Failed to create order',
          errorCode: result.errorCode,
          validationErrors: result.validationErrors,
        };
      }

      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: 'Network error occurred while creating order',
        errorCode: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Get order by ID
   */
  static async getOrderById(orderId: number): Promise<OrderResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${orderId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Get order by order number
   */
  static async getOrderByNumber(orderNumber: string): Promise<OrderResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/number/${orderNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  }

  /**
   * Get orders for a user
   */
  static async getUserOrders(
    userId: number,
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<any> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`${this.baseUrl}/user/${userId}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return {
        orders: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0,
      };
    }
  }

  /**
   * Generate order number (for testing)
   */
  static async generateOrderNumber(): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate-order-number`);
      
      if (!response.ok) {
        throw new Error('Failed to generate order number');
      }

      const result = await response.json();
      return result.orderNumber;
    } catch (error) {
      console.error('Error generating order number:', error);
      return `ORD-${Date.now()}`;
    }
  }
}
