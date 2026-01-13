'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { OrderData, PaymentResult } from '@/app/checkout/page';
import { CheckCircle, Package, Truck, Mail, Download, ArrowRight, Home, XCircle, Clock, Loader2 } from 'lucide-react';
import { InvoiceApiService } from '@/services/invoice-api';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getAuthToken } from '@/utils/auth';

interface OrderConfirmationProps {
  orderData: OrderData;
  paymentResult: PaymentResult;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderData,
  paymentResult
}) => {
  const { currentCurrency } = useCurrency();
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);
  const [error, setError] = useState('');

  // Handle invoice download
  const handleDownloadInvoice = async () => {
    const token = getAuthToken();

    setDownloadingInvoice(true);
    setError('');

    try {
      let result;

      if (token && orderData.orderDbId && orderData.orderDbId !== 0) {
        // Authenticated user - use regular invoice download
        result = await InvoiceApiService.downloadInvoice(orderData.orderDbId, token, currentCurrency.code);
      } else {
        // Guest user - use guest invoice download with order number
        result = await InvoiceApiService.downloadGuestInvoice(orderData.orderId, currentCurrency.code);
      }

      if (result.success && result.blob && result.filename) {
        InvoiceApiService.triggerDownload(result.blob, result.filename);
      } else {
        setError(result.message || 'Failed to download invoice');
      }
    } catch (error) {
      console.error('Error downloading invoice:', error);
      setError('Failed to download invoice. Please try again.');
    } finally {
      setDownloadingInvoice(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Order Status Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {paymentResult.status === 'success' ? (
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            ) : paymentResult.status === 'pending' ? (
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {paymentResult.status === 'success' ? 'Order Confirmed!' :
             paymentResult.status === 'pending' ? 'Order Pending' :
             'Order Failed'}
          </h1>
          <p className="text-gray-600 mb-4">
            {paymentResult.status === 'success' ?
              'Thank you for your purchase. Your order has been successfully placed.' :
             paymentResult.status === 'pending' ?
              'Your order is being processed. We will confirm once payment is complete.' :
              'There was an issue with your order. Please contact support for assistance.'}
          </p>

          <div className={`$
            paymentResult.status === 'success' ? 'bg-green-50' :
            paymentResult.status === 'pending' ? 'bg-yellow-50' :
            'bg-red-50'
          } rounded-lg p-4 inline-block`}>
            <p className={`text-sm ${
              paymentResult.status === 'success' ? 'text-green-800' :
              paymentResult.status === 'pending' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              <strong>Order Number:</strong> {orderData.orderId}
            </p>
            <p className={`text-sm ${
              paymentResult.status === 'success' ? 'text-green-800' :
              paymentResult.status === 'pending' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              <strong>Status:</strong> {orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)}
            </p>
            {paymentResult.status === 'success' && (
              <p className="text-sm text-green-800">
                <strong>Estimated Delivery:</strong> {orderData.estimatedDelivery}
              </p>
            )}
            {paymentResult.transactionId && (
              <p className={`text-sm ${
                paymentResult.status === 'success' ? 'text-green-800' :
                paymentResult.status === 'pending' ? 'text-yellow-800' :
                'text-red-800'
              }`}>
                <strong>Transaction ID:</strong> {paymentResult.transactionId}
              </p>
            )}
          </div>

          {paymentResult.status === 'success' && orderData.accountCreated && (
            <div className="mt-4 mx-auto max-w-xl bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start text-left">
              <Mail className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
              <div className="text-sm text-blue-800">
                <span className="font-medium">Account Created.</span> Check your email for login details and start enjoying member-only perks.
              </div>
            </div>
          )}
        </div>

        {/* Order Details */}
        <div className="space-y-6">

          {/* Next Steps */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-5 w-5 text-blue-600 mr-2" />
                  <h4 className="font-medium text-blue-900">Order Confirmation</h4>
                </div>
                <p className="text-sm text-blue-800">
                  You'll receive an email confirmation shortly with your order details.
                </p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Package className="h-5 w-5 text-yellow-600 mr-2" />
                  <h4 className="font-medium text-yellow-900">Order Processing</h4>
                </div>
                <p className="text-sm text-yellow-800">
                  We'll prepare your order and send you tracking information.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Truck className="h-5 w-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-900">Delivery</h4>
                </div>
                <p className="text-sm text-green-800">
                  Your order will be delivered by {orderData.estimatedDelivery}.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <div className="flex-1">
              {paymentResult.status === 'success' && (
                <button
                  onClick={handleDownloadInvoice}
                  disabled={downloadingInvoice}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingInvoice ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  {downloadingInvoice ? 'Downloading...' : 'Download Invoice'}
                </button>
              )}
            </div>
            
            <div className="flex gap-4">
              {paymentResult.status === 'success' && (
                <Link
                  href={`/track-order?orderNumber=${encodeURIComponent(orderData.orderId)}`}
                  className="flex items-center px-6 py-2 text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Track Order
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              )}
              
              <Link
                href="/"
                className="flex items-center px-6 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Home className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-gray-50 rounded-lg p-4 mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Need Help?</h4>
            <p className="text-sm text-gray-600 mb-2">
              If you have any questions about your order, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <a
                href="mailto:support@printoscar.com"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                support@printoscar.com
              </a>
              <a
                href="tel:+15712958929"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                +1 (571) 295-8929
              </a>
              <Link
                href="/contact"
                className="text-orange-600 hover:text-orange-700 underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
