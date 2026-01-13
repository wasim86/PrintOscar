'use client';

import React, { useState } from 'react';
import { ShippingAddress, PaymentMethod, PaymentResult } from '@/app/checkout/page';
import { ArrowLeft, Loader2, MapPin, CreditCard, Package, Clock, XCircle, CheckCircle, FileText } from 'lucide-react';
import { SimplePriceDisplay } from '@/components/Currency/PriceDisplay';
import { usePriceUtils } from '@/utils/priceUtils';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface OrderReviewProps {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentResult: PaymentResult | null; // Can be null for pre-payment review
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  onConfirm: () => void;
  onBack: () => void;
  isProcessing: boolean;
  isPrePaymentReview?: boolean; // New prop to indicate pre-payment review
  appliedCoupon?: {
    code: string;
    description: string;
    discountAmount: number;
  } | null;
}

export const OrderReview: React.FC<OrderReviewProps> = ({
  cartItems,
  shippingAddress,
  paymentResult,
  subtotal,
  shipping,
  tax,
  discount,
  total,
  onConfirm,
  onBack,
  isProcessing,
  isPrePaymentReview = false,
  appliedCoupon: externalAppliedCoupon
}) => {
  const { convertAndFormatPrice } = usePriceUtils();
  const paymentMethod = paymentResult?.paymentMethod;

  // State for Terms and Conditions validation
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

  // Simplified: just use the external coupon and passed totals
  const appliedCoupon = externalAppliedCoupon;
  // Removed internal coupon logic - using external coupon management only

  // Simplified: always use the passed props (calculated in checkout page)
  const displayTotals = {
    subtotal,
    discountAmount: discount,
    subtotalAfterDiscount: subtotal - discount,
    shippingAmount: shipping,
    taxAmount: tax,
    totalAmount: total
  };

  // Validation helper functions
  const isTermsAndPrivacyAccepted = () => {
    return termsAccepted && privacyAccepted;
  };

  const canProceedToPayment = () => {
    if (isPrePaymentReview) {
      return isTermsAndPrivacyAccepted() && !isProcessing;
    }
    return !isProcessing && paymentResult?.status !== 'failed';
  };

  const handleProceedClick = () => {
    if (isPrePaymentReview && !isTermsAndPrivacyAccepted()) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    onConfirm();
  };

  const formatPaymentMethod = (method: PaymentMethod) => {
    switch (method.type) {
      case 'credit_card':
        return `•••• •••• •••• ${method.cardNumber?.slice(-4) || '****'}`;
      case 'paypal':
        return 'PayPal Account';
      case 'apple_pay':
        return 'Apple Pay';
      case 'google_pay':
        return 'Google Pay';
      default:
        return 'Payment Method';
    }
  };

  const getPaymentStatusInfo = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          message: 'Payment Successful',
          description: 'Your payment has been processed successfully.'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          message: 'Payment Pending',
          description: 'Your payment is being processed. You will receive confirmation shortly.'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          message: 'Payment Failed',
          description: 'There was an issue processing your payment. Please try again.'
        };
      default:
        return {
          icon: Clock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          message: 'Payment Status Unknown',
          description: 'Unable to determine payment status.'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full mr-4">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Review Your Order</h2>
            <p className="text-sm text-gray-600">Please review your order details before placing</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-gray-400" />
              Order Items ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <img
                      src={item.image || '/placeholder-product.svg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">Category: {item.category}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {convertAndFormatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {convertAndFormatPrice(item.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-400" />
              Shipping Information
            </h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                  <p className="text-sm text-gray-600">{shippingAddress.firstName} {shippingAddress.lastName}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.email}</p>
                  <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600">{shippingAddress.address}</p>
                  {shippingAddress.apartment && (
                    <p className="text-sm text-gray-600">{shippingAddress.apartment}</p>
                  )}
                  <p className="text-sm text-gray-600">
                    {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{shippingAddress.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status or Ready for Payment */}
          {!isPrePaymentReview && paymentResult ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                Payment Status
              </h3>

              {(() => {
                const statusInfo = getPaymentStatusInfo(paymentResult.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-lg p-4 mb-4`}>
                    <div className="flex items-start">
                      <StatusIcon className={`h-5 w-5 ${statusInfo.color} mr-3 mt-0.5`} />
                      <div className="flex-1">
                        <h4 className={`font-medium ${statusInfo.color}`}>{statusInfo.message}</h4>
                        <p className="text-sm text-gray-600 mt-1">{statusInfo.description}</p>
                        {paymentResult.transactionId && (
                          <p className="text-xs text-gray-500 mt-2">
                            Transaction ID: {paymentResult.transactionId}
                          </p>
                        )}
                        {paymentResult.error && (
                          <p className="text-sm text-red-600 mt-2">
                            Error: {paymentResult.error}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{formatPaymentMethod(paymentMethod!)}</p>
                    {paymentMethod!.type === 'credit_card' && paymentMethod!.cardholderName && (
                      <p className="text-sm text-gray-600">{paymentMethod!.cardholderName}</p>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {paymentMethod!.type === 'credit_card' ? 'Credit Card' :
                     paymentMethod!.type === 'paypal' ? 'PayPal' :
                     paymentMethod!.type === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                Ready for Payment
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-600">Ready to Process Payment</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Review your order details above, then proceed to payment to complete your purchase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-black">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                <SimplePriceDisplay
                  price={displayTotals.subtotal}
                  size="sm"
                  className="font-medium"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <SimplePriceDisplay
                  price={displayTotals.shippingAmount}
                  size="sm"
                  className="font-medium"
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <SimplePriceDisplay
                  price={displayTotals.taxAmount}
                  size="sm"
                  className="font-medium"
                />
              </div>
              {appliedCoupon && displayTotals.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-600">Coupon Discount ({appliedCoupon.code})</span>
                  <span className="font-medium text-green-600">
                    -<SimplePriceDisplay
                      price={displayTotals.discountAmount}
                      size="sm"
                      className="inline"
                    />
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <SimplePriceDisplay
                    price={displayTotals.totalAmount}
                    size="lg"
                    className="font-semibold text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>



          {/* Terms and Conditions */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Required Agreements</h3>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start mb-3">
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => {
                  setTermsAccepted(e.target.checked);
                  if (showValidationError) setShowValidationError(false);
                }}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
                aria-describedby="terms-description"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a
                  href="/terms-of-sale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline font-medium"
                >
                  Terms and Conditions
                </a>
              </label>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="privacy"
                checked={privacyAccepted}
                onChange={(e) => {
                  setPrivacyAccepted(e.target.checked);
                  if (showValidationError) setShowValidationError(false);
                }}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded mt-0.5"
                aria-describedby="privacy-description"
              />
              <label htmlFor="privacy" className="ml-3 text-sm text-gray-700">
                I agree to the{' '}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-600 hover:text-orange-700 underline font-medium"
                >
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Validation Error Message */}
            {showValidationError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-red-800">
                    <p className="font-medium">Please accept the required agreements to continue:</p>
                    <ul className="mt-1 space-y-1">
                      {!termsAccepted && (
                        <li className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          <span>Accept the Terms and Conditions</span>
                        </li>
                      )}
                      {!privacyAccepted && (
                        <li className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-red-600 rounded-full"></span>
                          <span>Accept the Privacy Policy</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              disabled={isProcessing}
              className="flex items-center px-6 py-3 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isPrePaymentReview ? 'Back to Shipping' : 'Back to Payment'}
            </button>
            
            <button
              onClick={handleProceedClick}
              disabled={!canProceedToPayment()}
              className={`flex items-center px-8 py-3 font-medium rounded-lg focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                !canProceedToPayment()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-orange-600 text-white hover:bg-orange-700 focus:ring-orange-500'
              }`}
              aria-label={
                isPrePaymentReview && !isTermsAndPrivacyAccepted()
                  ? "Cannot proceed: Please accept Terms and Conditions and Privacy Policy"
                  : isPrePaymentReview
                  ? "Proceed to payment"
                  : "Place order"
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isPrePaymentReview ? 'Processing...' : 'Processing Order...'}
                </>
              ) : isPrePaymentReview && !isTermsAndPrivacyAccepted() ? (
                'Accept Terms to Continue'
              ) : isPrePaymentReview ? (
                `Proceed to Payment - ${convertAndFormatPrice(displayTotals.totalAmount)}`
              ) : paymentResult?.status === 'failed' ? (
                'Payment Failed - Cannot Place Order'
              ) : paymentResult?.status === 'pending' ? (
                `Place Order (Payment Pending) - ${convertAndFormatPrice(displayTotals.totalAmount)}`
              ) : (
                `Place Order - ${convertAndFormatPrice(displayTotals.totalAmount)}`
              )}
            </button>
          </div>

          {/* Additional validation message near button for pre-payment review */}
          {isPrePaymentReview && !isTermsAndPrivacyAccepted() && !showValidationError && (
            <div className="mt-3 text-center">
              <p className="text-sm text-gray-600">
                Please accept the Terms and Conditions and Privacy Policy above to continue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
