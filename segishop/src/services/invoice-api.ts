import { API_BASE_URL } from './config';

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  company: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
    email: string;
    website: string;
    taxId?: string;
  };
  customer: {
    customerId: number;
    name: string;
    email: string;
    phone?: string;
  };
  billingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  items: Array<{
    productId: number;
    name: string;
    description?: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    productAttributes?: string;
  }>;
  subTotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  couponDiscountAmount: number;
  totalAmount: number;
  notes?: string;
  terms?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  errorCode?: string;
  data?: InvoiceData;
}

export class InvoiceApiService {
  static async generateInvoice(orderId: number, token: string, currency?: string): Promise<InvoiceResponse> {
    try {
      const url = new URL(`${API_BASE_URL}/Invoice/order/${orderId}`);
      if (currency) {
        url.searchParams.append('currency', currency);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: 'Authentication required. Please log in.',
            errorCode: 'UNAUTHORIZED'
          };
        }
        
        if (response.status === 404) {
          const errorData = await response.json();
          return {
            success: false,
            message: errorData.message || 'Order not found or access denied.',
            errorCode: errorData.errorCode || 'ORDER_NOT_FOUND'
          };
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: InvoiceResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Invoice generation API error:', error);
      return {
        success: false,
        message: 'Unable to generate invoice. Please check your internet connection and try again.',
        errorCode: 'NETWORK_ERROR'
      };
    }
  }

  static async downloadInvoice(orderId: number, token: string, currency?: string): Promise<{ success: boolean; message?: string; blob?: Blob; filename?: string }> {
    try {
      const url = new URL(`${API_BASE_URL}/Invoice/order/${orderId}/download`);
      if (currency) {
        url.searchParams.append('currency', currency);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: 'Authentication required. Please log in.'
          };
        }
        
        if (response.status === 404) {
          return {
            success: false,
            message: 'Order not found or access denied.'
          };
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Invoice-${orderId}.html`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      return {
        success: true,
        blob,
        filename
      };
    } catch (error) {
      console.error('Invoice download API error:', error);
      return {
        success: false,
        message: 'Unable to download invoice. Please check your internet connection and try again.'
      };
    }
  }

  static async downloadGuestInvoice(orderNumber: string, currency?: string): Promise<{ success: boolean; message?: string; blob?: Blob; filename?: string }> {
    try {
      const url = new URL(`${API_BASE_URL}/Invoice/guest/order/${encodeURIComponent(orderNumber)}/download`);
      if (currency) {
        url.searchParams.append('currency', currency);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            success: false,
            message: 'Order not found.'
          };
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Invoice-${orderNumber}.html`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      return {
        success: true,
        blob,
        filename
      };
    } catch (error) {
      console.error('Error downloading guest invoice:', error);
      return {
        success: false,
        message: 'Failed to download invoice. Please try again.'
      };
    }
  }

  static async downloadInvoicePdf(orderId: number, token: string): Promise<{ success: boolean; message?: string; blob?: Blob; filename?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/Invoice/order/${orderId}/download-pdf`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          return {
            success: false,
            message: 'Authentication required. Please log in.'
          };
        }
        
        if (response.status === 404) {
          return {
            success: false,
            message: 'Order not found or access denied.'
          };
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      
      // Extract filename from Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `Invoice-${orderId}.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }

      return {
        success: true,
        blob,
        filename
      };
    } catch (error) {
      console.error('Invoice PDF download API error:', error);
      return {
        success: false,
        message: 'Unable to download PDF invoice. Please check your internet connection and try again.'
      };
    }
  }

  // Helper function to trigger file download
  static triggerDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}
