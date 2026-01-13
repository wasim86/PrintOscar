'use client';

import React, { useState } from 'react';
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { OrderTrackingApiService, OrderTrackingData } from '@/services/order-tracking-api';

// Remove the local interface since we're using the one from the API service

interface TrackOrderProps {
  initialOrderNumber?: string | null;
}

export const TrackOrder: React.FC<TrackOrderProps> = ({ initialOrderNumber }) => {
  const [orderId, setOrderId] = useState(initialOrderNumber || '');
  const [billingEmail, setBillingEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [error, setError] = useState('');



  const handleTrackOrder = async () => {
    setIsLoading(true);
    setError('');
    setOrderData(null);

    // Basic validation
    if (!orderId.trim()) {
      setError('Please enter your order ID');
      setIsLoading(false);
      return;
    }

    if (!billingEmail.trim()) {
      setError('Please enter your billing email');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(billingEmail)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Call real API
    try {
      const response = await OrderTrackingApiService.trackOrder({
        orderNumber: orderId.trim(),
        billingEmail: billingEmail.trim()
      });

      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      console.error('Order tracking error:', err);
      setError('Unable to track order. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return <Clock className="h-5 w-5 text-orange-500" />;
      case 'shipped':
      case 'in transit':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'out_for_delivery':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'shipped':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'out_for_delivery':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600">
          {initialOrderNumber
            ? 'Your order number has been pre-filled. Enter your billing email to track your package.'
            : 'Enter your order ID and billing email to track your package'
          }
        </p>
        {initialOrderNumber && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
            <p className="text-green-800 text-sm">
              ✅ Order number <strong>{initialOrderNumber}</strong> loaded from your recent order
            </p>
          </div>
        )}
      </div>

      {/* Tracking Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Order ID Input */}
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-gray-700 mb-2">
              Order ID *
            </label>
            <input
              type="text"
              id="orderId"
              name="orderId"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white"
              placeholder="e.g., ORD-2024-001"
            />
          </div>

          {/* Billing Email Input */}
          <div>
            <label htmlFor="billingEmail" className="block text-sm font-medium text-gray-700 mb-2">
              Billing Email *
            </label>
            <input
              type="email"
              id="billingEmail"
              name="billingEmail"
              value={billingEmail}
              onChange={(e) => setBillingEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors placeholder-gray-400 text-gray-900 bg-white"
              placeholder="your@email.com"
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {/* Track Button */}
        <button
          onClick={handleTrackOrder}
          disabled={isLoading}
          className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Tracking Order...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              Track Order
            </>
          )}
        </button>

        {/* Demo Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700 text-sm">
            <strong>Demo:</strong> Try Order ID: <code className="bg-blue-100 px-1 rounded">ORD-2024-001</code> 
            with Email: <code className="bg-blue-100 px-1 rounded">sarah.m@email.com</code>
          </p>
        </div>
      </div>

      {/* Order Details */}
      {orderData && (
        <div className="space-y-6">
          {/* Order Status Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Order #{orderData.orderNumber}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(orderData.status)}`}>
                {orderData.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-black">{new Date(orderData.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estimated Delivery</p>
                <p className="font-medium text-black">
                  {orderData.estimatedDelivery
                    ? new Date(orderData.estimatedDelivery).toLocaleDateString()
                    : 'TBD'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-medium text-black">{orderData.trackingNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Courier Service</p>
                <p className="font-medium text-black">{orderData.carrier || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
            <div className="space-y-4">
              {orderData.timeline.map((event, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(event.status)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.status}</h4>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()} at {new Date(event.date).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    {event.location && (
                      <p className="text-gray-500 text-xs flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{orderData.customerInfo.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{orderData.customerInfo.email}</span>
                </div>
                {orderData.customerInfo.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-900">{orderData.customerInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                <div>
                  <p className="text-gray-900">{orderData.shippingAddress.street}</p>
                  <p className="text-gray-900">
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
