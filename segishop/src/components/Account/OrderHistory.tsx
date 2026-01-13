'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Eye,
  Download,
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Loader2
} from 'lucide-react';
import { OrderApiService, OrderListResponse, OrderSummary, OrderResponse } from '@/services/order-api';
import { InvoiceApiService } from '@/services/invoice-api';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAuthToken } from '@/utils/auth';

interface OrderWithDetails extends OrderSummary {
  trackingNumber?: string;
  estimatedDelivery?: string;
  products?: {
    id: number;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
}

export const OrderHistory: React.FC = () => {
  const { customer } = useAuth();
  const { currentCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<Record<string, OrderResponse>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});
  const [downloadingInvoice, setDownloadingInvoice] = useState<Record<number, boolean>>({});

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      if (!customer?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await OrderApiService.getUserOrders(customer.id, 1, 50);

        if (response && response.orders) {
          // Convert API response to component format
          const convertedOrders: OrderWithDetails[] = response.orders.map((order: OrderSummary) => ({
            ...order,
            // Add mock tracking and delivery info for now
            trackingNumber: order.status === 'Shipped' || order.status === 'Delivered' ? `TRK${order.id}${Date.now().toString().slice(-6)}` : undefined,
            estimatedDelivery: order.status === 'Shipped' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
          }));

          setOrders(convertedOrders);
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load order history. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customer?.id]);

  // Fetch detailed order information when expanded
  const fetchOrderDetails = async (orderId: number) => {
    if (orderDetails[orderId.toString()] || loadingDetails[orderId.toString()]) {
      return;
    }

    try {
      setLoadingDetails(prev => ({ ...prev, [orderId.toString()]: true }));

      const orderDetail = await OrderApiService.getOrderById(orderId);

      if (orderDetail) {
        setOrderDetails(prev => ({ ...prev, [orderId.toString()]: orderDetail }));
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [orderId.toString()]: false }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'Returned':
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  // Handle invoice download
  const handleDownloadInvoice = async (orderId: number) => {
    const token = getAuthToken();
    if (!token) {
      setError('Authentication required. Please log in.');
      return;
    }

    setDownloadingInvoice(prev => ({ ...prev, [orderId]: true }));

    try {
      const result = await InvoiceApiService.downloadInvoice(orderId, token, currentCurrency.code);

      if (result.success && result.blob && result.filename) {
        InvoiceApiService.triggerDownload(result.blob, result.filename);
      } else {
        setError(result.message || 'Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Returned':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Handle order expansion
  const handleOrderExpand = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
      fetchOrderDetails(parseInt(orderId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-black"
          >
            <option value="all">All Status</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your order history...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : "You haven't placed any orders yet"
            }
          </p>
        </div>
      )}

      {/* Orders List */}
      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.itemCount} items
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
                    <div className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2">{order.status}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOrderExpand(order.id.toString())}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expanded Order Details */}
            {expandedOrder === order.id.toString() && (
              <div className="p-6">
                {loadingDetails[order.id.toString()] ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
                  </div>
                ) : orderDetails[order.id.toString()] ? (
                  <>
                    <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {orderDetails[order.id.toString()].items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.productName}</h5>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} • SKU: {item.productSKU || 'N/A'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">${item.totalPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.unitPrice.toFixed(2)} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Order Summary</h5>
                      <div className="space-y-2 text-sm text-black">
                        <div className="flex justify-between">
                          <span>Subtotal:</span>
                          <span>${orderDetails[order.id.toString()].subTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping:</span>
                          <span>${orderDetails[order.id.toString()].shippingAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>${orderDetails[order.id.toString()].taxAmount.toFixed(2)}</span>
                        </div>
                        {orderDetails[order.id.toString()].discountAmount > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount:</span>
                            <span>-${orderDetails[order.id.toString()].discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-base border-t pt-2">
                          <span>Total:</span>
                          <span>${orderDetails[order.id.toString()].totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleDownloadInvoice(order.id)}
                        disabled={downloadingInvoice[order.id]}
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingInvoice[order.id] ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {downloadingInvoice[order.id] ? 'Downloading...' : 'Download Invoice'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Failed to load order details</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};
