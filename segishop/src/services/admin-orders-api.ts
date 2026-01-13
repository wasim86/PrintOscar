import { API_BASE_URL } from './config';

// Types matching the backend DTOs
export interface AdminOrderListRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  customerEmail?: string;
  orderNumber?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface AdminOrderSummary {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  customerName: string;
  customerEmail: string;
  shippingCity: string;
  shippingState: string;
  shippingCountry: string;
  shippingMethodTitle?: string;
  paymentTransactionId?: string;
  couponCode?: string;
  couponDiscountAmount: number;
}

export interface AdminOrderStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  failedOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface AdminOrderListResponse {
  orders: AdminOrderSummary[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  stats: AdminOrderStats;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productSKU: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  productAttributes?: string;
}

export interface CustomerInfo {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AdminOrderDetail {
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
  
  // Shipping Information
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone?: string;
  shippingMethodTitle?: string;

  // Tracking Information
  trackingNumber?: string;
  courierService?: string;
  estimatedDeliveryDate?: string;

  // Billing Information (admin only)
  billingName?: string;
  billingAddress?: string;
  billingCity?: string;
  billingState?: string;
  billingZip?: string;
  billingCountry?: string;
  billingPhone?: string;
  
  // Coupon Information
  couponCode?: string;
  couponDiscountAmount: number;
  
  // Customer Information
  customer: CustomerInfo;
  
  // Order Items
  items: OrderItem[];
  
  // Admin-specific fields
  availableActions: OrderAction[];
}

export interface OrderAction {
  action: string;
  label: string;
  isEnabled: boolean;
  reason?: string;
}

export interface UpdateOrderStatus {
  status: string;
  notes?: string;
  notifyCustomer?: boolean;
  trackingNumber?: string;
  courierService?: string;
  estimatedDeliveryDate?: string;
}

export interface UpdateShippingAddress {
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  shippingPhone?: string;
}

export interface UpdateOrder {
  notes?: string;
  shippingMethodTitle?: string;
  shippingAddress?: UpdateShippingAddress;
}



export interface AdminOrderActionResponse {
  success: boolean;
  message: string;
  errorCode?: string;
  order?: AdminOrderDetail;
}



// Payment Records Types
export interface PaymentRecordDto {
  id: number;
  orderId: number;
  paymentMethod: string;
  paymentType: string;
  status: string;
  amount: number;
  currency: string;
  transactionId?: string;
  paymentIntentId?: string;
  chargeId?: string;
  refundId?: string;
  refundedFromPaymentId?: number;
  paymentMethodDetails?: string;
  failureReason?: string;
  notes?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
  processedBy?: string;
}

export interface PaymentSummaryDto {
  totalPaid: number;
  totalRefunded: number;
  netAmount: number;
  paymentCount: number;
  refundCount: number;
  payments: PaymentRecordDto[];
  refunds: PaymentRecordDto[];
}

export interface RefundRequestDto {
  orderId: number;
  paymentRecordId: number;
  amount: number;
  reason: string;
  notes?: string;
  notifyCustomer: boolean;
}

export interface RefundResponseDto {
  success: boolean;
  message: string;
  errorCode?: string;
  refundRecord?: PaymentRecordDto;
  refundedAmount: number;
  remainingAmount: number;
}

// Order Status History Types
export interface OrderStatusHistoryDto {
  id: number;
  orderId: number;
  fromStatus: string;
  toStatus: string;
  notes?: string;
  changedBy?: string;
  changeReason?: string;
  customerNotified: boolean;
  notificationMethod?: string;
  createdAt: string;
  metadata?: string;
}

export interface StatusMilestoneDto {
  status: string;
  label: string;
  description: string;
  isCompleted: boolean;
  isCurrent: boolean;
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface OrderStatusTimelineDto {
  orderId: number;
  orderNumber: string;
  currentStatus: string;
  statusHistory: OrderStatusHistoryDto[];
  milestones: StatusMilestoneDto[];
}

class AdminOrdersApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('printoscar_admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  private getAuthHeadersForDownload(): HeadersInit {
    const token = localStorage.getItem('printoscar_admin_token');
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  async getOrders(request: AdminOrderListRequest = {}): Promise<AdminOrderListResponse> {
    const params = new URLSearchParams();
    
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch orders: ${response.statusText}`);
    }

    return response.json();
  }

  async getOrderById(id: number): Promise<AdminOrderDetail> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order: ${response.statusText}`);
    }

    return response.json();
  }

  async updateOrderStatus(id: number, updateData: UpdateOrderStatus): Promise<AdminOrderActionResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order status: ${response.statusText}`);
    }

    return response.json();
  }

  async updateOrder(id: number, updateData: UpdateOrder): Promise<AdminOrderActionResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order: ${response.statusText}`);
    }

    return response.json();
  }



  async getOrderStats(startDate?: string, endDate?: string): Promise<AdminOrderStats> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await fetch(`${API_BASE_URL}/admin/orders/stats?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order stats: ${response.statusText}`);
    }

    return response.json();
  }

  async exportOrders(request: AdminOrderListRequest = {}): Promise<Blob> {
    const params = new URLSearchParams();

    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/admin/orders/export?${params}`, {
      method: 'GET',
      headers: this.getAuthHeadersForDownload(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to export orders: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return response.blob();
  }

  // Payment Records Methods
  async getOrderPaymentSummary(orderId: number): Promise<PaymentSummaryDto> {
    const response = await fetch(`${API_BASE_URL}/admin/payments/order/${orderId}/summary`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment summary: ${response.statusText}`);
    }

    return response.json();
  }

  async getOrderPaymentRecords(orderId: number): Promise<PaymentRecordDto[]> {
    const response = await fetch(`${API_BASE_URL}/admin/payments/order/${orderId}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch payment records: ${response.statusText}`);
    }

    return response.json();
  }

  async processRefund(refundRequest: RefundRequestDto): Promise<RefundResponseDto> {
    console.log('Sending refund request:', refundRequest);

    // Process real refund through payment gateway (PayPal/Stripe)
    const response = await fetch(`${API_BASE_URL}/admin/payments/refund`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(refundRequest),
    });

    const responseData = await response.json();
    console.log('Refund response:', responseData);

    if (!response.ok) {
      // Try to get detailed error message from response
      const errorMessage = responseData?.message ||
                          responseData?.errors?.join(', ') ||
                          `Failed to process refund: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return responseData;
  }

  // Database-only refund functionality removed - only gateway refunds are supported

  // Order Status History Methods
  async getOrderTimeline(orderId: number): Promise<OrderStatusTimelineDto> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/timeline`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order timeline: ${response.statusText}`);
    }

    return response.json();
  }

  async getOrderStatusHistory(orderId: number): Promise<OrderStatusHistoryDto[]> {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/history`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order status history: ${response.statusText}`);
    }

    return response.json();
  }
}

export const adminOrdersApi = new AdminOrdersApiService();
