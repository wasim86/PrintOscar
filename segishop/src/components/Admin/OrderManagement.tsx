'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Calendar,
  DollarSign,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  adminOrdersApi,
  AdminOrderListRequest,
  AdminOrderSummary,
  AdminOrderStats,
  AdminOrderDetail
} from '../../services/admin-orders-api';
import { OrderDetailModal } from './OrderDetailModal';

export const OrderManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');

  const [orders, setOrders] = useState<AdminOrderSummary[]>([]);
  const [stats, setStats] = useState<AdminOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  const [sortBy, setSortBy] = useState('CreatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load orders
  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const request: AdminOrderListRequest = {
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder
      };

      if (searchTerm) {
        // Try to determine if it's an order number or email
        if (searchTerm.startsWith('ORD-')) {
          request.orderNumber = searchTerm;
        } else if (searchTerm.includes('@')) {
          request.customerEmail = searchTerm;
        } else {
          request.customerEmail = searchTerm; // Default to email search
        }
      }

      if (statusFilter) request.status = statusFilter;
      if (paymentStatusFilter) request.paymentStatus = paymentStatusFilter;

      const response = await adminOrdersApi.getOrders(request);

      setOrders(response.orders);
      setStats(response.stats);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [currentPage, statusFilter, paymentStatusFilter, sortBy, sortOrder]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadOrders();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);



  // Handle order actions
  const handleViewOrder = async (orderId: number) => {
    try {
      const orderDetail = await adminOrdersApi.getOrderById(orderId);
      setSelectedOrder(orderDetail);
      setShowOrderDetail(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    }
  };

  const handleExportOrders = async (exportRequest?: AdminOrderListRequest) => {
    try {
      setIsExporting(true);
      setError(null);

      const request: AdminOrderListRequest = exportRequest || {
        status: statusFilter || undefined,
        paymentStatus: paymentStatusFilter || undefined,
        customerEmail: searchTerm.includes('@') ? searchTerm : undefined,
        orderNumber: searchTerm.startsWith('ORD-') ? searchTerm : undefined,
      };

      const blob = await adminOrdersApi.exportOrders(request);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Show success message
      setSuccessMessage('Orders exported successfully!');
      setError(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export orders');
    } finally {
      setIsExporting(false);
      setShowExportModal(false);
    }
  };



  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'confirmed':
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'shipped':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  // Display stats (use real stats or fallback)
  const displayStats = stats || {
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    failedOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-orange-600" />
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-3">
                <button
                  onClick={loadOrders}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <div className="mt-2 text-sm text-green-700">{successMessage}</div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and track all customer orders</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setShowExportModal(true)}
            disabled={isExporting}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button
            onClick={loadOrders}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-gray-900">{displayStats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-yellow-600">{displayStats.pendingOrders}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-blue-600">{displayStats.confirmedOrders}</div>
          <div className="text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-red-600">{displayStats.failedOrders}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-green-600">${displayStats.totalRevenue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Total Revenue</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-2xl font-bold text-purple-600">${displayStats.averageOrderValue.toFixed(2)}</div>
          <div className="text-sm text-gray-600">Avg Order Value</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order number or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 placeholder-gray-500 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white text-sm sm:text-base"
              >
                <option value="" className="text-gray-900">All Status</option>
                <option value="Pending" className="text-gray-900">Pending</option>
                <option value="Confirmed" className="text-gray-900">Confirmed</option>
                <option value="Shipped" className="text-gray-900">Shipped</option>
                <option value="Delivered" className="text-gray-900">Delivered</option>
                <option value="Cancelled" className="text-gray-900">Cancelled</option>
                <option value="Failed" className="text-gray-900">Failed</option>
              </select>
              <select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-gray-900 bg-white text-sm sm:text-base"
              >
                <option value="" className="text-gray-900">All Payment Status</option>
                <option value="Pending" className="text-gray-900">Payment Pending</option>
                <option value="Completed" className="text-gray-900">Payment Completed</option>
                <option value="Failed" className="text-gray-900">Payment Failed</option>
                <option value="Refunded" className="text-gray-900">Refunded</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-600">
              Showing {orders.length} of {totalCount} orders
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                      <div className="text-sm text-gray-500">{order.itemCount} items</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-orange-600 hover:text-orange-700"
                        title="View Order"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Edit Order"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages} ({totalCount} total orders)
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-black"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-3 py-1 text-sm text-black">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 text-black"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowOrderDetail(false);
            setSelectedOrder(null);
          }}
          onOrderUpdated={loadOrders}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          onExport={handleExportOrders}
          isExporting={isExporting}
          currentFilters={{
            status: statusFilter,
            paymentStatus: paymentStatusFilter,
            searchTerm
          }}
        />
      )}


    </div>
  );
};

// Export Modal Component
interface ExportModalProps {
  onClose: () => void;
  onExport: (request?: AdminOrderListRequest) => void;
  isExporting: boolean;
  currentFilters: {
    status: string;
    paymentStatus: string;
    searchTerm: string;
  };
}

const ExportModal: React.FC<ExportModalProps> = ({ onClose, onExport, isExporting, currentFilters }) => {
  const [exportType, setExportType] = useState<'current' | 'all' | 'dateRange'>('current');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeFilters, setIncludeFilters] = useState(true);

  const handleExport = () => {
    let request: AdminOrderListRequest = {};

    if (exportType === 'current' && includeFilters) {
      request = {
        status: currentFilters.status || undefined,
        paymentStatus: currentFilters.paymentStatus || undefined,
        customerEmail: currentFilters.searchTerm.includes('@') ? currentFilters.searchTerm : undefined,
        orderNumber: currentFilters.searchTerm.startsWith('ORD-') ? currentFilters.searchTerm : undefined,
      };
    } else if (exportType === 'dateRange') {
      request = {
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        ...(includeFilters ? {
          status: currentFilters.status || undefined,
          paymentStatus: currentFilters.paymentStatus || undefined,
        } : {})
      };
    }
    // For 'all', we pass an empty request to get all orders

    onExport(request);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg max-w-md w-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Export Orders</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isExporting}
          >
            <XCircle className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Export Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Options
            </label>
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="current"
                  name="exportType"
                  value="current"
                  checked={exportType === 'current'}
                  onChange={(e) => setExportType(e.target.value as 'current')}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  disabled={isExporting}
                />
                <label htmlFor="current" className="ml-3 text-sm text-gray-900">
                  Current view
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="all"
                  name="exportType"
                  value="all"
                  checked={exportType === 'all'}
                  onChange={(e) => setExportType(e.target.value as 'all')}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  disabled={isExporting}
                />
                <label htmlFor="all" className="ml-3 text-sm text-gray-900">
                  All orders
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="radio"
                  id="dateRange"
                  name="exportType"
                  value="dateRange"
                  checked={exportType === 'dateRange'}
                  onChange={(e) => setExportType(e.target.value as 'dateRange')}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  disabled={isExporting}
                />
                <label htmlFor="dateRange" className="ml-3 text-sm text-gray-900">
                  Date range
                </label>
              </div>
            </div>
          </div>

          {/* Date Range Inputs */}
          {exportType === 'dateRange' && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  disabled={isExporting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  disabled={isExporting}
                />
              </div>
            </div>
          )}

          {/* Include Filters Option */}
          {(exportType === 'current' || exportType === 'dateRange') && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeFilters"
                checked={includeFilters}
                onChange={(e) => setIncludeFilters(e.target.checked)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                disabled={isExporting}
              />
              <label htmlFor="includeFilters" className="ml-3 text-sm text-gray-900">
                Include current filters (status, payment status)
              </label>
            </div>
          )}

          {/* Current Filters Display */}
          {includeFilters && (currentFilters.status || currentFilters.paymentStatus || currentFilters.searchTerm) && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Active filters:</p>
              <div className="space-y-1 text-sm text-gray-600">
                {currentFilters.status && <p>• Status: {currentFilters.status}</p>}
                {currentFilters.paymentStatus && <p>• Payment: {currentFilters.paymentStatus}</p>}
                {currentFilters.searchTerm && <p>• Search: {currentFilters.searchTerm}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || (exportType === 'dateRange' && (!startDate || !endDate))}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
          >
            {isExporting ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
