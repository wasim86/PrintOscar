'use client';

import React, { useState } from 'react';
import {
  X,
  Package,
  User,
  MapPin,
  CreditCard,
  Calendar,
  DollarSign,
  Edit,
  Save,
  AlertCircle,
  History,
  Receipt
} from 'lucide-react';
import { AdminOrderDetail, adminOrdersApi, UpdateOrderStatus } from '../../services/admin-orders-api';
import PaymentRecordsSection from './PaymentRecordsSection';
import OrderStatusHistorySection from './OrderStatusHistorySection';

interface OrderDetailModalProps {
  order: AdminOrderDetail;
  onClose: () => void;
  onOrderUpdated: () => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  onClose,
  onOrderUpdated
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState(order.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || '');
  const [courierService, setCourierService] = useState(order.courierService || '');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState(
    order.estimatedDeliveryDate ? order.estimatedDeliveryDate.split('T')[0] : ''
  );
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'payments' | 'history'>('details');

  const handleStatusUpdate = async () => {
    if (newStatus === order.status) return;

    try {
      setIsUpdatingStatus(true);
      setError(null);

      const updateData: UpdateOrderStatus = {
        status: newStatus,
        notes: statusNotes || undefined,
        notifyCustomer: true,
        trackingNumber: trackingNumber || undefined,
        courierService: courierService || undefined,
        estimatedDeliveryDate: estimatedDeliveryDate || undefined
      };

      const response = await adminOrdersApi.updateOrderStatus(order.id, updateData);
      
      if (response.success) {
        onOrderUpdated();
        onClose();
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Order status update error:', err);
      if (err instanceof Error) {
        setError(`Update failed: ${err.message}`);
      } else {
        setError('Failed to update order status - please check console for details');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'confirmed':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'processing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <p className="text-gray-600">{order.orderNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Package className="h-4 w-4 inline mr-2" />
              Order Details
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Receipt className="h-4 w-4 inline mr-2" />
              Payment Records
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <History className="h-4 w-4 inline mr-2" />
              Status History
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Order Status</div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-1 ${getStatusColor(order.status)}`}>
                {order.status}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Payment Status</div>
              <div className="text-lg font-semibold text-gray-900">{order.paymentStatus}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600">Order Date</div>
              <div className="text-lg font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Current Tracking Information */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Current Tracking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-600">Tracking Number</div>
                <div className="text-lg font-semibold text-gray-900">
                  {order.trackingNumber || 'Not assigned'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Courier Service</div>
                <div className="text-lg font-semibold text-gray-900">
                  {order.courierService || 'Not assigned'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Estimated Delivery</div>
                <div className="text-lg font-semibold text-gray-900">
                  {order.estimatedDeliveryDate
                    ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                    : 'Not set'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Edit className="h-5 w-5 mr-2" />
              Update Order Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  placeholder="Add a note about this status change..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                />
              </div>
            </div>

            {/* Tracking Information Section */}
            <div className="mt-6 border-t pt-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Tracking Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Courier Service
                  </label>
                  <select
                    value={courierService}
                    onChange={(e) => setCourierService(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  >
                    <option value="">Select courier...</option>
                    <option value="UPS">UPS</option>
                    <option value="FedEx">FedEx</option>
                    <option value="DHL">DHL</option>
                    <option value="USPS">USPS</option>
                    <option value="Amazon Logistics">Amazon Logistics</option>
                    <option value="OnTrac">OnTrac</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Delivery Date
                  </label>
                  <input
                    type="date"
                    value={estimatedDeliveryDate}
                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdatingStatus || newStatus === order.status}
                className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingStatus ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Name</div>
                <div className="text-gray-900">{order.customer.firstName} {order.customer.lastName}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Email</div>
                <div className="text-gray-900">{order.customer.email}</div>
              </div>
              {order.customer.phone && (
                <div>
                  <div className="text-sm text-gray-600">Phone</div>
                  <div className="text-gray-900">{order.customer.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Shipping Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Shipping Address</div>
                <div className="text-gray-900">
                  {order.shippingName}<br />
                  {order.shippingAddress}<br />
                  {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                  {order.shippingCountry}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Shipping Method</div>
                <div className="text-gray-900">{order.shippingMethodTitle || 'Standard Shipping'}</div>
                {order.shippingPhone && (
                  <>
                    <div className="text-sm text-gray-600 mt-2">Phone</div>
                    <div className="text-gray-900">{order.shippingPhone}</div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600">Payment Status</div>
                <div className="text-gray-900">{order.paymentStatus}</div>
              </div>
              {order.paymentTransactionId && (
                <div>
                  <div className="text-sm text-gray-600">Transaction ID</div>
                  <div className="text-gray-900 font-mono text-sm">{order.paymentTransactionId}</div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <div className="font-medium text-gray-900">{item.productName}</div>
                    <div className="text-sm text-gray-600">SKU: {item.productSKU}</div>
                    <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                    
                    {/* Product Attributes Display */}
                    {item.productAttributes && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                        {(() => {
                          try {
                            const attrs = JSON.parse(item.productAttributes);
                            return (
                              <div className="space-y-1">
                                {attrs.size && <div><span className="font-medium">Size:</span> {attrs.size}</div>}
                                
                                {/* Medal Color */}
                                {attrs.medalColor && (
                                  <div><span className="font-medium">Medal Color:</span> {attrs.medalColor}</div>
                                )}

                                {/* Medal Custom Name ($3) */}
                                {attrs.customName && (
                                  <div className="text-orange-700 font-medium border-l-2 border-orange-500 pl-2">
                                    Medal Custom Name: {attrs.customName}
                                  </div>
                                )}
                                
                                {/* Generic Custom Text */}
                                {attrs.customText && (
                                  <div className="text-gray-700 italic border-l-2 border-gray-300 pl-2">
                                    Custom Text: {attrs.customText}
                                  </div>
                                )}
                                
                                {/* Uploaded Logo */}
                                {attrs.logoUrl && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="font-medium">Logo:</span>
                                    <a 
                                      href={attrs.logoUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-blue-600 hover:underline inline-flex items-center"
                                    >
                                      View {attrs.logoName || 'File'}
                                    </a>
                                  </div>
                                )}
                                
                                {/* Uploaded Text File */}
                                {attrs.textFileUrl && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Text File:</span>
                                    <a 
                                      href={attrs.textFileUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-blue-600 hover:underline inline-flex items-center"
                                    >
                                      Download {attrs.textFileName || 'File'}
                                    </a>
                                  </div>
                                )}

                                {/* Selected Configurations (Dynamic) */}
                                {attrs.selectedOptions && Array.isArray(attrs.selectedOptions) && attrs.selectedOptions.length > 0 && (
                                  <div className="mt-1 pt-1 border-t border-gray-200">
                                    {attrs.selectedOptions.map((opt: any, idx: number) => (
                                      <div key={idx}>
                                        <span className="font-medium">{opt.configurationName}:</span> {opt.optionName}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          } catch (e) {
                            return <div className="text-red-400">Error parsing attributes</div>;
                          }
                        })()}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">${item.totalPrice.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} each</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Order Totals
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${order.subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">${order.shippingAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${order.taxAmount.toFixed(2)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

              {/* Notes */}
              {order.notes && (
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{order.notes}</div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <PaymentRecordsSection
              orderId={order.id}
              onRefundProcessed={onOrderUpdated}
            />
          )}

          {activeTab === 'history' && (
            <OrderStatusHistorySection orderId={order.id} />
          )}
        </div>
      </div>
    </div>
  );
};
